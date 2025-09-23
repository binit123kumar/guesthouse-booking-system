import React, { useEffect, useState } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Total Bookings</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Room Type</th>
            <th style={styles.th}>Check-In</th>
            <th style={styles.th}>Check-Out</th>
            <th style={styles.th}>Payment</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>{b.fullName}</td>
              <td style={styles.td}>{b.roomType}</td>
              <td style={styles.td}>{b.checkIn}</td>
              <td style={styles.td}>{b.checkOut}</td>
              <td style={styles.td}>{b.paymentStatus}</td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td style={styles.td} colSpan="6">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  th: {
    padding: "12px 16px",
    backgroundColor: "#4e73df",
    color: "#fff",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "16px",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #ccc",
    fontSize: "16px",
    color: "#333",
  },
};

export default AdminBookings;
