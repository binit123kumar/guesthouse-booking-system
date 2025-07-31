import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
    paymentStatus: "",
  });

  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  const calculateDays = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffTime = outDate - inDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (["roomType", "checkIn", "checkOut"].includes(name)) {
      const days = calculateDays(updatedData.checkIn, updatedData.checkOut);
      let rate = 0;
      switch (updatedData.roomType) {
        case "Single": rate = 800; break;
        case "Double": rate = 1200; break;
        case "Suite": rate = 1800; break;
        default: rate = 0;
      }
      setAmount(days > 0 && rate > 0 ? rate * days : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, roomType, checkIn, checkOut, paymentStatus } = formData;

    if (!fullName || !email || !phone || !roomType || !checkIn || !checkOut || !paymentStatus) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (checkIn < today) {
      setError("⚠️ Check-in date cannot be in the past.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("⚠️ Check-out must be after Check-in.");
      return;
    }

    setError("");

    const bookingData = { ...formData, amount, createdAt: new Date().toISOString() };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      const result = await res.json();

      if (result.success) {
        // ✅ Redirect to Success Page with booking ID
        navigate(`/success?id=${result.id}`);
      } else {
        alert("❌ Failed to save booking.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Error occurred while saving.");
    }
  };

  const upiString = `upi://pay?pa=9525594357@paytm&pn=Guest House&am=${amount}&cu=INR&tn=Booking for ${formData.fullName}`;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Guest House Booking Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} style={styles.input} />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={styles.input} />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={styles.input} />

        <select name="roomType" value={formData.roomType} onChange={handleChange} style={styles.input}>
          <option value="">Select Room Type</option>
          <option value="Single">Single Room (₹800/day)</option>
          <option value="Double">Double Room (₹1200/day)</option>
          <option value="Suite">Suite (₹1800/day)</option>
        </select>

        <div style={styles.dateRow}>
          <div style={styles.dateGroup}>
            <label style={styles.label}>Check-In Date:</label>
            <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.dateGroup}>
            <label style={styles.label}>Check-Out Date:</label>
            <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        <label style={styles.label}>Payment Method:</label>
        <div style={styles.radioGroup}>
          <label>
            <input type="radio" name="paymentStatus" value="Online" checked={formData.paymentStatus === "Online"} onChange={handleChange} />
            Online
          </label>
          <label>
            <input type="radio" name="paymentStatus" value="Cash" checked={formData.paymentStatus === "Cash"} onChange={handleChange} />
            Cash
          </label>
        </div>

        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

        {formData.paymentStatus === "Online" && amount > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>Scan QR to pay ₹{amount}:</p>
            <QRCodeSVG value={upiString} size={200} />
          </div>
        )}

        {formData.paymentStatus && (
          <button type="submit" style={styles.button}>
            {formData.paymentStatus === "Online" ? "✅ Confirm Payment & Book" : "📝 Confirm Booking (Cash)"}
          </button>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "650px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#003366",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "6px",
    color: "#444",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
    paddingLeft: "5px",
  },
  dateRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  dateGroup: {
    flex: "1",
    minWidth: "45%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#003366",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Booking;
