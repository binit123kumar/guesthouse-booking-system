import React, { useEffect, useState } from "react";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>📋 Admin - All Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.fullName}</td>
                <td>{booking.email}</td>
                <td>{booking.phone}</td>
                <td>{booking.roomType}</td>
                <td>{booking.checkIn}</td>
                <td>{booking.checkOut}</td>
                <td>{booking.paymentStatus}</td>
                <td>₹{booking.amount}</td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookingList;
