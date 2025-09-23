import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    purpose: "",
    roomType: "",
    roomsRequired: "",
    checkInDate: "",
    checkInTime: "",
    checkOutDate: "",
    checkOutTime: "",
    category: "",
    paymentStatus: "",
    guests: []
  });

  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState(""); // For availability status

  const calculateDays = (inDate, outDate) => {
    if (!inDate || !outDate) return 0;
    const start = new Date(inDate);
    const end = new Date(outDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const calculateAmount = (updated) => {
    const days = calculateDays(updated.checkInDate, updated.checkOutDate);
    const rooms = parseInt(updated.roomsRequired) || 1;
    const guestsCount = updated.guests.length + 1;
    const minRooms = Math.ceil(guestsCount / 3);
    const totalRooms = Math.max(rooms, minRooms);
    let rate = 0;
    switch (updated.roomType) {
      case "Single": rate = 800; break;
      case "Double": rate = 1200; break;
      case "Suite": rate = 1800; break;
      default: rate = 0;
    }
    return days > 0 ? days * rate * totalRooms : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (["roomType", "checkInDate", "checkOutDate", "roomsRequired"].includes(name)) {
      setAmount(calculateAmount(updated));
    }
  };

  const handleGuestChange = (i, field, value) => {
    const guests = [...formData.guests];
    guests[i][field] = value;
    setFormData({ ...formData, guests });
    setAmount(calculateAmount({ ...formData, guests }));
  };

  const addGuest = () => {
    setFormData({ ...formData, guests: [...formData.guests, { name: "", age: "", address: "", email: "", phone: "", purpose: "" }] });
  };

  const removeGuest = (i) => {
    const guests = formData.guests.filter((_, idx) => idx !== i);
    setFormData({ ...formData, guests });
    setAmount(calculateAmount({ ...formData, guests }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.roomType || !formData.checkInDate || !formData.checkOutDate) {
      setError("⚠️ Please fill all required fields.");
      return;
    }
    const bookingData = { ...formData, amount, createdAt: new Date().toISOString() };
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const result = await res.json();
      result.success ? navigate(`/success?id=${result.id}`) : alert("❌ Booking Failed");
    } catch {
      alert("⚠️ Server Error");
    }
  };

  // ---- New function for checking availability ----
  const checkAvailability = async () => {
    if (!formData.roomType) {
      alert("Please select Room Type first");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/rooms/check-availability/${formData.roomType}`);
      setAvailability(res.data.available ? "✅ Rooms Available" : "❌ Rooms Not Available");
    } catch (err) {
      console.error(err);
      setAvailability("⚠️ Error checking availability");
    }
  };

  const upiString = amount > 0 ? `upi://pay?pa=9525594357@paytm&pn=GuestHouse&am=${amount}&cu=INR` : "";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Aryabhatta University – Guest House Booking</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Existing form inputs */}
        <select style={styles.input} name="roomType" value={formData.roomType} onChange={handleChange} required>
          <option value="">Select Room Type</option>
          <option value="Single">Single Room (₹800/day)</option>
          <option value="Double">Double Room (₹1200/day)</option>
          <option value="Suite">Suite (₹1800/day)</option>
        </select>
        <input style={styles.input} type="number" name="roomsRequired" value={formData.roomsRequired} onChange={handleChange} placeholder="No. of Rooms Required" required />

        {/* ----- New Check Availability Button ----- */}
        <button type="button" style={{ ...styles.addBtn, background: "#007BFF" }} onClick={checkAvailability}>
          🔍 Check Availability
        </button>
        {availability && <p style={{ fontWeight: "bold", color: availability.includes("✅") ? "green" : "red" }}>{availability}</p>}

        {/* Remaining existing form inputs */}
        <div style={styles.row}>
          <div style={styles.col}>
            <label>Check-In Date</label>
            <input style={styles.input} type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />
          </div>
          <div style={styles.col}>
            <label>Check-In Time</label>
            <input style={styles.input} type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} required />
          </div>
        </div>

        {/* Rest of Booking.jsx stays the same (guests, payment, QR, submit) */}
        {/* ... */}
      </form>
    </div>
  );
}

// Existing styles remain the same
const styles = {
  container: { maxWidth: "750px", margin: "30px auto", padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 3px 10px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#003366", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  row: { display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "space-between" },
  col: { flex: "1", minWidth: "45%", display: "flex", flexDirection: "column" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "15px", width: "100%" },
  label: { fontWeight: "bold", margin: "5px 0" },
  subTitle: { color: "#003366", marginTop: "20px" },
  guestBox: { border: "1px solid #ddd", padding: "10px", borderRadius: "8px", marginBottom: "10px", background: "#f9f9f9" },
  addBtn: { background: "#4CAF50", color: "white", padding: "8px", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "10px" },
  removeBtn: { background: "#FF4B4B", color: "white", padding: "6px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "5px" },
  radioGroup: { display: "flex", gap: "20px", marginBottom: "10px" },
  button: { padding: "12px", background: "#003366", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "15px" }
};

export default Booking;
