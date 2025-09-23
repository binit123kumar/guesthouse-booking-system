import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    availableRooms: 0,
    onlinePayments: 0,
    cashPayments: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Admin Dashboard</h1>
      <div style={styles.cardGrid}>
        <div style={{ ...styles.card, backgroundColor: "#4e73df" }} onClick={() => navigate("/admin/bookings")}>
          <h3 style={styles.cardTitle}>Total Bookings</h3>
          <p style={styles.cardValue}>{stats.totalBookings}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#1cc88a" }} onClick={() => navigate("/admin/rooms")}>
          <h3 style={styles.cardTitle}>Available Rooms</h3>
          <p style={styles.cardValue}>{stats.availableRooms}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#36b9cc" }} onClick={() => navigate("/admin/online")}>
          <h3 style={styles.cardTitle}>Online Payments</h3>
          <p style={styles.cardValue}>{stats.onlinePayments}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#f6c23e", color: "#000" }} onClick={() => navigate("/admin/cash")}>
          <h3 style={styles.cardTitle}>Cash Payments</h3>
          <p style={styles.cardValue}>{stats.cashPayments}</p>
        </div>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>🔓 Logout</button>
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
    textAlign: "center",
    fontSize: "36px",
    color: "#343a40",
    marginBottom: "40px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "50px",
  },
  card: {
    padding: "30px",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  cardValue: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  logoutButton: {
    display: "block",
    margin: "auto",
    padding: "14px 32px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#e74a3b",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "background-color 0.3s ease",
  },
};

export default AdminDashboard;
