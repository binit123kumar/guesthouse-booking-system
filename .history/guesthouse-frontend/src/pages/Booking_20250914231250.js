import React, { useState } from "react";

const BookingForm = () => {
  const [roomType, setRoomType] = useState("Single");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState(null);
  const [message, setMessage] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // ✅ उपलब्धता की जांच
  const checkAvailability = () => {
    if (!checkInDate || !checkOutDate) {
      setMessage("⚠️ कृपया चेक-इन और चेक-आउट की तारीखें चुनें।");
      return;
    }

    // डमी उपलब्धता लॉजिक
    const available = roomType === "Single" ? 5 : roomType === "Double" ? 2 : 0;
    
    setAvailableRooms(available);
    if (available > 0) {
      setMessage(`✅ ${available} ${roomType} कमरे उपलब्ध हैं!`);
      setShowBookingForm(true);
    } else {
      setMessage(`❌ इस प्रकार के कमरे इन तारीखों के लिए उपलब्ध नहीं हैं।`);
      setShowBookingForm(false);
    }
  };

  // ✅ बुकिंग सबमिट करें
  const handleBooking = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage("⚠️ कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    const bookingDetails = {
      roomType,
      checkInDate,
      checkOutDate,
      ...formData
    };

    console.log("Booking Details:", bookingDetails);
    
    setMessage("✅ आपकी बुकिंग सफलतापूर्वक हो गई है!");
    setAvailableRooms(null);
    setShowBookingForm(false);
    setFormData({ fullName: "", email: "", phone: "" });
  };

  // ✅ Inline Styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif'
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  };

  const labelStyle = {
    fontWeight: 'bold'
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };
  
  const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center'
  };

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb'
  };

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderColor: '#f5c6cb'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>रूम बुकिंग</h2>
      
      <div style={sectionStyle}>
        <label style={labelStyle}>कमरे का प्रकार:</label>
        <select style={inputStyle} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>
        
        <label style={labelStyle}>चेक-इन तारीख:</label>
        <input style={inputStyle} type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
        
        <label style={labelStyle}>चेक-आउट तारीख:</label>
        <input style={inputStyle} type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
        
        <button style={buttonStyle} onClick={checkAvailability}>उपलब्धता जांचें</button>
      </div>

      {message && (
        <p style={message.startsWith('✅') ? successMessageStyle : errorMessageStyle}>
          {message}
        </p>
      )}

      {showBookingForm && (
        <form style={sectionStyle} onSubmit={handleBooking}>
          <h3 style={{ marginTop: '20px' }}>अपनी बुकिंग पूरी करें</h3>
          <input
            style={inputStyle}
            type="text"
            placeholder="पूरा नाम"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <input
            style={inputStyle}
            type="email"
            placeholder="ईमेल"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            style={inputStyle}
            type="tel"
            placeholder="फ़ोन नंबर"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <button style={buttonStyle} type="submit">अभी बुक करें</button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;