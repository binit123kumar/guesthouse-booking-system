import React, { useEffect, useState } from "react";

const AdminCash = () => {
  const [cashPayments, setCashPayments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (b) => b.paymentStatus?.toLowerCase() === "cash"
        );
        setCashPayments(filtered);
      })
      .catch((err) => console.error("Error fetching cash payments:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💵 Cash Payments</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Check-In</th>
          </tr>
        </thead>
        <tbody>
          {cashPayments.map((p, i) => (
            <tr key={i}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>{p.fullName}</td>
              <td style={styles.td}>₹{p.amount}</td>
              <td style={styles.td}>{p.checkIn}</td>
            </tr>
          ))}
          {cashPayments.length === 0 && (
            <tr>
              <td style={styles.td} colSpan="4">
                No cash payments found.
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
    backgroundColor: "#f6c23e",
    color: "#000",
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

export default AdminCash;
