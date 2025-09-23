import React, { useEffect, useState } from "react";

const TOTAL_ROOMS = 20;

const AdminRooms = () => {
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        const bookedCount = data.length;
        const remaining = TOTAL_ROOMS - bookedCount;

        const roomList = [];

        for (let i = 1; i <= remaining; i++) {
          roomList.push({
            id: 200 + i,
            type: i % 3 === 0 ? "Suite" : i % 2 === 0 ? "Double" : "Single",
            status: "Available",
          });
        }

        setAvailableRooms(roomList);
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        🛏 Available Rooms ({availableRooms.length} / {TOTAL_ROOMS})
      </h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Room No</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {availableRooms.map((r) => (
            <tr key={r.id}>
              <td style={styles.td}>{r.id}</td>
              <td style={styles.td}>{r.type}</td>
              <td style={styles.td}>{r.status}</td>
            </tr>
          ))}
          {availableRooms.length === 0 && (
            <tr>
              <td style={styles.td} colSpan="3">
                No rooms available.
              </td>
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
    backgroundColor: "#1cc88a",
    color: "#fff",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    fontSize: "16px",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #ccc",
    fontSize: "16px",
    color: "#333",
  },
};

export default AdminRooms;
