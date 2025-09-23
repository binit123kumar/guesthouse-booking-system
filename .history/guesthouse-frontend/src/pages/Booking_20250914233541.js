import React, { useState } from "react";

const BookingForm = () => {
  const [roomType, setRoomType] = useState("Single");
  const [roomsRequired, setRoomsRequired] = useState("1");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [message, setMessage] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    purpose: "",
    category: "Official",
  });

  const checkAvailability = () => {
    if (!checkInDate || !checkOutDate || !roomsRequired) {
      setMessage("⚠️ Please fill in all required information.");
      return;
    }

    fetch("http://localhost:5000/api/bookings/summary")
      .then((res) => res.json())
      .then((data) => {
        const bookedRooms = data.daily[checkInDate] || 0;
        const available = 20 - bookedRooms; // Assuming 20 total rooms
        if (available >= parseInt(roomsRequired)) {
          setMessage(`✅ ${available} ${roomType} rooms are available!`);
          setShowBookingForm(true);
        } else {
          setMessage(`❌ This type of room is not available for these dates.`);
          setShowBookingForm(false);
        }
      })
      .catch((err) => {
        console.error("Availability check error:", err);
        setMessage("❌ An error occurred while checking availability. Please try again later.");
      });
  };

  const handleBooking = (e) => {
    e.preventDefault();

    const bookingData = {
      ...formData,
      roomType,
      roomsRequired,
      checkInDate,
      checkOutDate,
      paymentStatus: "Online", // Assuming all bookings are online
      amount: calculateAmount(roomType, checkInDate, checkOutDate, roomsRequired),
    };

    fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(`✅ Booking successful! Your booking ID is: ${data.bookingId}`);
        // Reset form or navigate to a success page
      })
      .catch((err) => {
        console.error("Booking submission error:", err);
        setMessage("❌ An error occurred while submitting the booking. Please try again later.");
      });
  };

  const calculateAmount = (type, inDate, outDate, rooms) => {
    const dailyRate = type === "Single" ? 800 : type === "Double" ? 1200 : 2000;
    const days = (new Date(outDate) - new Date(inDate)) / (1000 * 60 * 60 * 24);
    return days * dailyRate * parseInt(rooms);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏨 Book a Room</h2>

      <div style={styles.formSection}>
        <label style={styles.label}>Room Type:</label>
        <select style={styles.input} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single Room (₹800/night)</option>
          <option value="Double">Double Room (₹1200/night)</option>
          <option value="Suite">Suite Room (₹2000/night)</option>
        </select>
        
        <label style={styles.label}>Number of Rooms:</label>
        <input 
          style={styles.input} 
          type="number" 
          value={roomsRequired} 
          onChange={(e) => setRoomsRequired(e.target.value)} 
          min="1"
        />

        <label style={styles.label}>Check-In Date:</label>
        <input style={styles.input} type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
        
        <label style={styles.label}>Check-Out Date:</label>
        <input style={styles.input} type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
        
        <button style={styles.button} onClick={checkAvailability}>Check Availability</button>
      </div>

      {message && (
        <p style={message.startsWith('✅') ? styles.successMessage : styles.errorMessage}>
          {message}
        </p>
      )}

      {showBookingForm && (
        <form style={styles.formSection} onSubmit={handleBooking}>
          <h3 style={{ marginTop: '20px' }}>Complete Your Booking</h3>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Purpose of Visit"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          />
          <select style={styles.input} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="Official">Official</option>
            <option value="Private">Private</option>
            <option value="Semi-Private">Semi-Private</option>
          </select>

          <button style={styles.button} type="submit">Submit Booking</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    background: '#fff',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#003366',
    marginBottom: '20px'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  button: {
    padding: '12px',
    fontSize: '18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  successMessage: {
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '20px'
  },
  errorMessage: {
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '20px'
  }
};

export default BookingForm;