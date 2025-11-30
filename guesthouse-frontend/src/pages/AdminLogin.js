import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Local login storage
const localLogin = (token) => {
  localStorage.setItem("adminToken", token);
};

const AdminLogin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // FIXED → Admin लिखने पर सही email भेजेगा
  const getFullEmail = (inputID) => {
    if (inputID.toLowerCase() === "admin") {
      return "binit491@gmail.com"; // ← अपना असली Admin Email यहाँ डालें
    }
    return inputID;
  };

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!id || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    const finalEmail = getFullEmail(id);
    const finalPassword = password;

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: finalEmail, password: finalPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        localLogin(data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Network error. Please ensure the backend server is running.");
    }
  };

  return (
    <div style={styles.container}>
      <img src="/logo192.png" alt="Admin Avatar" style={styles.avatar} />
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username/ID (Type 'Admin')"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={styles.input}
        />

        {/* FIXED PASSWORD INPUT */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Login
        </button>
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

// CSS Styles
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
