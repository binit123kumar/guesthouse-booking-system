import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        position: "fixed",
        left: "20px",
        bottom: "20px",
        backgroundColor: "#003366",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <FaHome />
      Home
    </button>
  );
};

export default HomeButton;
