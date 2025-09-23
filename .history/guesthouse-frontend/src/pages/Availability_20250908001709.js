import React, { useEffect, useState } from "react";

const TOTAL_ROOMS = 50;

const Availability = () => {
  const [summary, setSummary] = useState({ daily: {}, weekly: {}, monthly: {} });
  const [view, setView] = useState("daily");

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Availability fetch error:", err));
  }, []);

  const data = summary[view] || {};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛏️ Room Availability</h2>

      <div style={styles.buttonGroup}>
        <button style={view === "daily" ? styles.activeBtn : styles.btn} onClick={() => setView("daily")}>Daily</button>
        <button style={view === "weekly" ? styles.activeBtn : styles.btn} onClick={() => setView("weekly")}>Weekly</button>
        <button style={view === "monthly" ? styles.activeBtn : styles.btn} onClick={() => setView("monthly")}>Monthly</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>{view === "daily" ? "Date" : view === "weekly" ? "Week" : "Month"}</th>
            <th>Booked Rooms</th>
            <th>Available Rooms</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, booked]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{booked}</td>
              <td>{TOTAL_ROOMS - booked < 0 ? 0 : TOTAL_ROOMS - booked}</td>
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
    marginTop: "20px",
    background: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
};

export default Availability;
