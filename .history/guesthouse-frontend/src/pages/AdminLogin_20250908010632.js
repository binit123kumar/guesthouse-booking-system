// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) { setError("Please fill all fields."); return; }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else setError(data.message || "Invalid credentials");
    } catch {
      setError("⚠️ Server Error. Try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={styles.input} />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { background: "#f1f4f9", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "400px" },
  heading: { fontSize: "24px", marginBottom: "30px", color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "6px" },
  button: { padding: "12px", fontSize: "16px", backgroundColor: "#003366", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  error: { color: "red", fontSize: "14px" },
};

export default AdminLogin;
