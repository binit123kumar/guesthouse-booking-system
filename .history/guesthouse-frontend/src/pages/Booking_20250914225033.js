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
    persons: "",   // 🔹 New field for number of persons
    guests: []
  });

  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState(""); // For availability status

  // ---- Helper Functions ----
  const calculateDays = (inDate, outDate) => {
    if (!inDate || !outDate) return 0;
    const start = new Date(inDate);
    const end = new Date(outDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const calculateAmount = (updated) => {
    const days = calculateDays(updated.checkInDate, updated.checkOutDate);
    const rooms = parseInt(updated.roomsRequired) || 1;
    const guestsCount = parseInt(updated.persons) || 1;
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
    if (["roomType", "checkInDate", "checkOutDate", "roomsRequired", "persons"].includes(name)) {
      setAmount(calculateAmount(updated));
    }
  };

  // ---- Availability Check Function ----
  const checkAvailability = async () => {
    if (!formData.roomType || !formData.persons || !formData.checkInDate) {
      alert("⚠️ Please select Room Type, Number of Persons and Check-in Date.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/rooms/check-availability", {
        roomType: formData.roomType,
        persons: formData.persons,
        checkInDate: formData.checkInDate
      });
      setAvailability(res.data.available ? "✅ Room is available!" : "❌ No rooms available for selected criteria.");
    } catch (err) {
      console.error(err);
      setAvailability("⚠️ Error checking availability");
    }
  };

  // ---- Booking Submit ----
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

  const upiString = amount > 0 ? `upi://pay?pa=9525594357@paytm&pn=GuestHouse&am=${amount}&cu=INR` : "";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Aryabhatta University – Guest House Booking</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Room Type */}
        <select style={styles.input} name="roomType" value={formData.roomType} onChange={handleChange} required>
          <option value="">Select Room Type</option>
          <option value="Single">Single Room (₹800/day)</option>
          <option value="Double">Double Room (₹1200/day)</option>
          <option value="Suite">Suite (₹1800/day)</option>
        </select>

        {/* Number of Persons */}
        <input style={styles.input} type="number" name="persons" value={formData.persons} onChange={handleChange} placeholder="Number of Persons" required />

        {/* Rooms Required */}
        <input style={styles.input} type="number" name="roomsRequired" value={formData.roomsRequired} onChange={handleChange} placeholder="No. of Rooms Required" required />

        {/* Check-in Date */}
        <label>Check-In Date</label>
        <input style={styles.input} type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />

        {/* Check Availability Button */}
        <button type="button" style={{ ...styles.addBtn, background: "#007BFF" }} onClick={checkAvailability}>
          🔍 Check Availability
        </button>
        {availability && <p style={{ fontWeight: "bold", color: availability.includes("✅") ? "green" : "red" }}>{availability}</p>}

        {/* Check-out Date */}
        <label>Check-Out Date</label>
        <input style={styles.input} type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />

        {/* Submit */}
        <button type="submit" style={styles.button}>Book Now</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "750px", margin: "30px auto", padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 3px 10px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#003366", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "15px", width: "100%" },
  addBtn: { background: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" },
  button: { padding: "12px", background: "#003366", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "15px" }
};

export default Booking;
