import React, { useEffect, useState } from "react";

const AdminPendingBookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [declineReason, setDeclineReason] = useState({});

  const fetchPendingBookings = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/bookings/pending")
      .then((res) => res.json())
      .then((data) => {
        setPendingBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pending bookings:", err);
        setLoading(false);
        setMessage("Error fetching data.");
      });
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const handleApprove = (booking) => {
    const roomNumber = prompt("Please enter the room number to assign:");
    if (!roomNumber) return;

    fetch("http://localhost:5000/api/bookings/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tempId: booking.tempId, roomNumber }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        fetchPendingBookings(); // Refresh the list
      })
      .catch((err) => {
        console.error("Error approving booking:", err);
        setMessage("Error approving booking.");
      });
  };

  const handleDecline = (booking) => {
    const reason = declineReason[booking.tempId];
    if (!reason) {
        alert("Please provide a reason for declining.");
        return;
    }

    fetch("http://localhost:5000/api/bookings/decline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tempId: booking.tempId, reason }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        fetchPendingBookings(); // Refresh the list
      })
      .catch((err) => {
        console.error("Error declining booking:", err);
        setMessage("Error declining booking.");
      });
  };

  if (loading) {
    return <div style={styles.container}>Loading pending requests...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⏳ Pending Booking Requests</h2>
      {message && <p style={styles.message}>{message}</p>}
      
      {pendingBookings.length === 0 ? (
        <p style={styles.noRequests}>No pending booking requests at this time.</p>
      ) : (
        <div style={styles.cardContainer}>
          {pendingBookings.map((booking) => (
            <div key={booking.tempId} style={styles.bookingCard}>
              <h3>{booking.fullName}</h3>
              <p><strong>Room Type:</strong> {booking.roomType}</p>
              <p><strong>Dates:</strong> {booking.checkInDate} to {booking.checkOutDate}</p>
              <p><strong>Rooms:</strong> {booking.roomsRequired}</p>
              <p><strong>Contact:</strong> {booking.email}</p>

              <div style={styles.declineSection}>
                  <textarea
                    placeholder="Reason for decline"
                    value={declineReason[booking.tempId] || ""}
                    onChange={(e) => setDeclineReason({ ...declineReason, [booking.tempId]: e.target.value })}
                    style={styles.declineInput}
                  />
                  <button onClick={() => handleDecline(booking)} style={styles.declineBtn}>Decline</button>
              </div>
              
              <button onClick={() => handleApprove(booking)} style={styles.approveBtn}>Approve</button>
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
        color: "#4CAF50",
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
        borderLeft: "5px solid #f6c23e",
    },
    declineSection: {
        marginTop: "15px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    declineInput: {
      width: "95%",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    approveBtn: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        marginTop: "10px",
    },
    declineBtn: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
};

export default AdminPendingBookings;