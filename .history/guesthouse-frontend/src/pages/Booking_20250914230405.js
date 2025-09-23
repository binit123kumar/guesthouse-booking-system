import React, { useState } from "react";

const BookingForm = () => {
  const [roomType, setRoomType] = useState("Single");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    roomsRequired: 1,
  });

  // ✅ Check availability
  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      setMessage("⚠️ Please select check-in and check-out dates.");
      return;
    }

    const res = await fetch("/api/rooms/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomType, checkInDate, checkOutDate }),
    });

    const data = await res.json();
    setAvailableRooms(data.availableRooms);
    setMessage(data.message);
  };

  // ✅ Submit Booking
  const submitBooking = async (e) => {
    e.preventDefault();
    if (!availableRooms) {
      setMessage("⚠️ Room not available. Check availability first.");
      return;
    }

    const bookingData = {
      ...formData,
      roomType,
      checkInDate,
      checkOutDate,
      roomsRequired: formData.roomsRequired,
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="booking-form">
      <h2>Guest House Booking</h2>
      <div>
        <label>Room Type:</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>
      </div>
      <div>
        <label>Check-In:</label>
        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
      </div>
      <div>
        <label>Check-Out:</label>
        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
      </div>
      <button onClick={checkAvailability}>Check Availability</button>

      {availableRooms !== null && (
        <div>
          {availableRooms > 0 ? (
            <div>
              <p>✅ Room is available!</p>
              <form onSubmit={submitBooking}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Rooms Required"
                  min={1}
                  max={availableRooms}
                  value={formData.roomsRequired}
                  onChange={(e) => setFormData({ ...formData, roomsRequired: e.target.value })}
                  required
                />
                <button type="submit">Book Now</button>
              </form>
            </div>
          ) : (
            <p>❌ Room not available.</p>
          )}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;
