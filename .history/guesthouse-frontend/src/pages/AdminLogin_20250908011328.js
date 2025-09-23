// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("adminUser"));

    if (
      // ✅ Option 1: Hardcoded email
      (email.toLowerCase() === "admin@aku.ac.in" && password === "admin123") ||

      // ✅ Option 2: Registered user
      (storedUser &&
        email.toLowerCase() === storedUser.email.toLowerCase() &&
        password === storedUser.password) ||

      // ✅ Option 3: Classic admin
      (email === "Admin" && password === "admin123")
    ) {
      setError("");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <img src="/logo192.png" alt="Admin Avatar" style={styles.avatar} />
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>Login</button>
      </form>

      <p style={styles.registerText}>
        New User?{" "}
        <span style={styles.link} onClick={() => navigate("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "40px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "10px",
    marginTop: "100px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  avatar: {
    width: "80px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  registerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#333",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default AdminLogin;
