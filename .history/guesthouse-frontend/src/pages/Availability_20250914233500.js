import React, { useEffect, useState } from "react";

const TOTAL_ROOMS = 50;

const Availability = () => {
  const [summary, setSummary] = useState({ daily: {}, weekly: {}, monthly: {} });
  const [view, setView] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/bookings/summary")
        .then((res) => res.json())
        .then((data) => {
          setSummary(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Availability fetch error:", err);
          setLoading(false);
        });
    };

    fetchData(); // first call
    const interval = setInterval(fetchData, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const data = summary[view] || {};

  if (loading) {
    return <div style={styles.container}>Loading availability...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛏️ Room Availability</h2>
      <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "16px", color: "#555" }}>
        Total Rooms: {TOTAL_ROOMS}
      </p>

      <div style={styles.buttonGroup}>
        <button style={view === "daily" ? styles.activeBtn : styles.btn} onClick={() => setView("daily")}>Daily</button>
        <button style={view === "weekly" ? styles.activeBtn : styles.btn} onClick={() => setView("weekly")}>Weekly</button>
        <button style={view === "monthly" ? styles.activeBtn : styles.btn} onClick={() => setView("monthly")}>Monthly</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>{view === "daily" ? "Date" : view === "weekly" ? "Week" : "Month"}</th>
            <th style={styles.th}>Booked Rooms</th>
            <th style={styles.th}>Available Rooms</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, booked]) => (
            <tr key={key}>
              <td style={styles.td}>{key}</td>
              <td style={styles.td}>{booked}</td>
              <td style={styles.td}>{TOTAL_ROOMS - booked < 0 ? 0 : TOTAL_ROOMS - booked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    background: "#f8f9fc",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#343a40",
    marginBottom: "20px",
  },
  buttonGroup: {
    textAlign: "center",
    marginBottom: "20px",
  },
  btn: {
    margin: "5px",
    padding: "10px 20px",
    border: "1px solid #007bff",
    borderRadius: "6px",
    background: "#fff",
    color: "#007bff",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  activeBtn: {
    margin: "5px",
    padding: "10px 20px",
    border: "1px solid #007bff",
    borderRadius: "6px",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  th: {
    padding: "12px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "left",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #ddd",
  },
};

export default Availability;