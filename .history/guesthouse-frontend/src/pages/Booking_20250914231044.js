import React, { useState } from "react";
import './BookingForm.css'; // स्टाइलिंग के लिए CSS फ़ाइल

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
    // यहाँ आप बैकएंड API को कॉल करने का लॉजिक जोड़ेंगे।
    // अभी के लिए हम एक डमी चेक करेंगे।
    // असली कोड में, यह एक 'fetch' या 'axios' रिक्वेस्ट होगा।

    if (!checkInDate || !checkOutDate) {
      setMessage("⚠️ कृपया चेक-इन और चेक-आउट की तारीखें चुनें।");
      return;
    }

    // यहाँ हम एक डमी लॉजिक का उपयोग कर रहे हैं।
    // मान लीजिए 'Single' के लिए 5 कमरे और 'Double' के लिए 2 कमरे हमेशा उपलब्ध हैं।
    // 'Suite' कभी-कभी उपलब्ध नहीं होती।
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

    // यहाँ आप बुकिंग डेटा को बैकएंड API पर भेजेंगे।
    // असली कोड में, यह एक 'fetch' या 'axios' POST रिक्वेस्ट होगा।
    const bookingDetails = {
      roomType,
      checkInDate,
      checkOutDate,
      ...formData
    };

    console.log("Booking Details:", bookingDetails);
    
    // बुकिंग सफल होने पर
    setMessage("✅ आपकी बुकिंग सफलतापूर्वक हो गई है!");
    setAvailableRooms(null); // फ़ॉर्म को रीसेट करें
    setShowBookingForm(false);
    setFormData({ fullName: "", email: "", phone: "" });
  };

  return (
    <div className="booking-container">
      <h2>रूम बुकिंग</h2>
      <div className="availability-checker">
        <label>कमरे का प्रकार:</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>
        
        <label>चेक-इन तारीख:</label>
        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
        
        <label>चेक-आउट तारीख:</label>
        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
        
        <button onClick={checkAvailability}>उपलब्धता जांचें</button>
      </div>

      {message && <p className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}

      {showBookingForm && (
        <form className="booking-form" onSubmit={handleBooking}>
          <h3>अपनी बुकिंग पूरी करें</h3>
          <input
            type="text"
            placeholder="पूरा नाम"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <input
            type="email"
            placeholder="ईमेल"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="फ़ोन नंबर"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <button type="submit">अभी बुक करें</button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;