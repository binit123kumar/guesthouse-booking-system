// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, password } = formData;
    if (!name || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // ✅ Save user to localStorage
    localStorage.setItem("adminUser", JSON.stringify(formData));

    setError("");
    alert("Registration Successful!");
    setFormData({ name: "", email: "", phone: "", password: "" });
    navigate("/admin/login"); // optional: auto redirect to login
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/logo192.png" alt="Logo" style={styles.logo} />
        <h2 style={styles.heading}>New User Registration</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={styles.loginText}>
          Already registered?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/admin/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#f1f4f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "420px",
  },
  logo: {
    width: "70px",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  loginText: {
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

export default Register;
