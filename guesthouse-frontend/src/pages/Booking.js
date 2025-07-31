import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

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

  const upiString = amount > 0 ? `upi://pay?pa=9525594357@paytm&pn=GuestHouse&am=${amount}&cu=INR` : "";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Aryabhatta University – Guest House Booking</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
        <input style={styles.input} name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
        <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input style={styles.input} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" required />
        <input style={styles.input} name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose of Visit" required />
        <input style={styles.input} type="number" name="roomsRequired" value={formData.roomsRequired} onChange={handleChange} placeholder="No. of Rooms Required" required />
        <select style={styles.input} name="roomType" value={formData.roomType} onChange={handleChange} required>
          <option value="">Select Room Type</option>
          <option value="Single">Single Room (₹800/day)</option>
          <option value="Double">Double Room (₹1200/day)</option>
          <option value="Suite">Suite (₹1800/day)</option>
        </select>
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
        <div style={styles.row}>
          <div style={styles.col}>
            <label>Check-Out Date</label>
            <input style={styles.input} type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />
          </div>
          <div style={styles.col}>
            <label>Check-Out Time</label>
            <input style={styles.input} type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} required />
          </div>
        </div>
        <select style={styles.input} name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Official">Official</option>
          <option value="Semi-Private">Semi-Private</option>
          <option value="Private">Private</option>
        </select>
        <h3 style={styles.subTitle}>Additional Guests</h3>
        {formData.guests.map((g, i) => (
          <div key={i} style={styles.guestBox}>
            <input style={styles.input} placeholder="Full Name" value={g.name} onChange={(e) => handleGuestChange(i, "name", e.target.value)} required />
            <input style={styles.input} type="number" placeholder="Age" value={g.age} onChange={(e) => handleGuestChange(i, "age", e.target.value)} required />
            <input style={styles.input} placeholder="Address" value={g.address} onChange={(e) => handleGuestChange(i, "address", e.target.value)} required />
            <input style={styles.input} type="email" placeholder="Email" value={g.email} onChange={(e) => handleGuestChange(i, "email", e.target.value)} required />
            <input style={styles.input} type="tel" placeholder="Phone" value={g.phone} onChange={(e) => handleGuestChange(i, "phone", e.target.value)} required />
            <input style={styles.input} placeholder="Purpose of Visit" value={g.purpose} onChange={(e) => handleGuestChange(i, "purpose", e.target.value)} required />
            <button type="button" onClick={() => removeGuest(i)} style={styles.removeBtn}>❌</button>
          </div>
        ))}
        <button type="button" onClick={addGuest} style={styles.addBtn}>➕ Add Guest</button>
        <label style={styles.label}>Payment Method:</label>
        <div style={styles.radioGroup}>
          <label><input type="radio" name="paymentStatus" value="Online" checked={formData.paymentStatus === "Online"} onChange={handleChange} required /> Online</label>
          <label><input type="radio" name="paymentStatus" value="Cash" checked={formData.paymentStatus === "Cash"} onChange={handleChange} required /> Cash</label>
        </div>
        {amount > 0 && <p style={{ fontWeight: "bold", color: "#003366" }}>Total Amount: ₹{amount}</p>}
        {formData.paymentStatus === "Online" && amount > 0 && (
          <div style={{ textAlign: "center", margin: "10px" }}>
            <p>📲 Scan & Pay ₹{amount}</p>
            <QRCodeSVG value={upiString} size={180} />
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={styles.button}>✅ Confirm Booking</button>
      </form>
    </div>
  );
}

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
