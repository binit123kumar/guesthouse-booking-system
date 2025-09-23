import React, { useEffect, useState } from "react";

const AdminDeclinedBookings = () => {
  const [declinedBookings, setDeclinedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDeclinedBookings = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/bookings") // fetching all to filter declined ones
      .then((res) => res.json())
      .then((data) => {
        const declined = data.filter(booking => booking.status === "declined");
        setDeclinedBookings(declined);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching declined bookings:", err);
        setLoading(false);
        setMessage("Error fetching data.");
      });
  };

  useEffect(() => {
    fetchDeclinedBookings();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading declined requests...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>❌ Declined Booking Requests</h2>
      {message && <p style={styles.message}>{message}</p>}
      
      {declinedBookings.length === 0 ? (
        <p style={styles.noRequests}>No declined booking requests at this time.</p>
      ) : (
        <div style={styles.cardContainer}>
          {declinedBookings.map((booking) => (
            <div key={booking.tempId} style={styles.bookingCard}>
              <h3>{booking.fullName}</h3>
              <p><strong>Room Type:</strong> {booking.roomType}</p>
              <p><strong>Dates:</strong> {booking.checkInDate} to {booking.checkOutDate}</p>
              <p><strong>Rooms:</strong> {booking.roomsRequired}</p>
              <p><strong>Decline Reason:</strong> {booking.declineReason || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
        padding: "40px",
        background: "#f8f9fc",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
    },
    title: {
        fontSize: "28px",
        marginBottom: "20px",
        textAlign: "center",
        color: "#333",
    },
    message: {
        textAlign: "center",
        color: "#dc3545",
        fontWeight: "bold",
    },
    noRequests: {
        textAlign: "center",
        color: "#666",
        fontSize: "18px",
    },
    cardContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
    },
    bookingCard: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderLeft: "5px solid #e74a3b",
    },
};

export default AdminDeclinedBookings;