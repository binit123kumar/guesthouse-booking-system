import React, { useEffect, useState } from "react";

const TOTAL_ROOMS = 20;

const AdminRooms = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/bookings")
        .then((res) => res.json())
        .then((data) => {
          const today = new Date();
          // ✅ Count only active bookings
          const activeBookings = data.filter((b) => new Date(b.checkOut || b.checkOutDate) >= today);
          const bookedCount = activeBookings.reduce((sum, b) => sum + (parseInt(b.roomsRequired) || 1), 0);
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
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bookings:", err);
          setLoading(false);
        });
    };

    fetchData(); // first call
    const interval = setInterval(fetchData, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading rooms...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏨 Available Rooms ({TOTAL_ROOMS})</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Room No</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {availableRooms.length > 0 ? (
            availableRooms.map((r) => (
              <tr key={r.id}>
                <td style={styles.td}>{r.id}</td>
                <td style={styles.td}>{r.type}</td>
                <td style={styles.td}>{r.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.td} colSpan="3">No rooms available.</td>
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
    fontSize: "16px",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
  },
};

export default AdminRooms;