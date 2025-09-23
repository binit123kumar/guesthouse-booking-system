import React, { useEffect, useState } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/bookings")
        .then((res) => res.json())
        .then((data) => {
          setBookings(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bookings:", err);
          setLoading(false);
        });
    };

    fetchData(); 
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval); 
  }, []);

  const downloadInvoice = (bookingId) => {
    // This assumes the backend uses a proper ID, not an array index
    window.open(`http://localhost:5000/api/bookings/${bookingId}/invoice`, "_blank");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return { color: "green", fontWeight: "bold" };
      case "declined":
        return { color: "red", fontWeight: "bold" };
      case "pending":
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading bookings...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 All Bookings</h2>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Temp ID</th>
            <th style={styles.th}>Booking ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Room Type</th>
            <th style={styles.th}>Check-In</th>
            <th style={styles.th}>Check-Out</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Decline Reason</th>
            <th style={styles.th}>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b, i) => (
              <tr key={b.tempId || i}>
                <td style={styles.td}>{b.tempId}</td>
                <td style={styles.td}>{b.bookingId || "N/A"}</td>
                <td style={styles.td}>{b.fullName}</td>
                <td style={styles.td}>{b.roomType}</td>
                <td style={styles.td}>{b.checkInDate}</td>
                <td style={styles.td}>{b.checkOutDate}</td>
                <td style={{ ...styles.td, ...getStatusStyle(b.status) }}>{b.status}</td>
                <td style={styles.td}>{b.declineReason || "N/A"}</td>
                <td style={styles.td}>
                  {b.status === "approved" && (
                      <button style={styles.invoiceBtn} onClick={() => downloadInvoice(b.bookingId)}>
                          Invoice
                      </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.td} colSpan="9">No bookings found.</td>
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
    fontSize: "14px",
    textTransform: "uppercase",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
  },
  invoiceBtn: {
    padding: "8px 12px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminBookings;