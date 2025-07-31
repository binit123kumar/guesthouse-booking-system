import React from "react";

function Success() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get("id");

  const downloadInvoice = () => {
    window.open(`http://localhost:5000/api/bookings/${bookingId}/invoice`, "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Booking Successful!</h2>
      <p>Your booking has been confirmed.</p>
      <button 
        onClick={downloadInvoice} 
        style={{ padding: "10px 20px", background: "green", color: "white", border: "none", borderRadius: "5px" }}>
        ⬇️ Download Invoice PDF
      </button>
    </div>
  );
}

export default Success;
