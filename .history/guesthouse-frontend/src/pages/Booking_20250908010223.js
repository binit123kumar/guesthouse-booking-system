// src/pages/Booking.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", address: "", email: "", phone: "", purpose: "", roomType: "",
    roomsRequired: "", checkInDate: "", checkInTime: "", checkOutDate: "", checkOutTime: "",
    category: "", paymentStatus: "", guests: []
  });
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  // --- Calculate days and amount ---
  const calculateDays = (inDate, outDate) => { if(!inDate||!outDate) return 0; return Math.max(1, Math.ceil((new Date(outDate) - new Date(inDate))/(1000*60*60*24))); };
  const calculateAmount = (updated) => {
    const days = calculateDays(updated.checkInDate, updated.checkOutDate);
    const rooms = parseInt(updated.roomsRequired)||1;
    const guestsCount = updated.guests.length + 1;
    const minRooms = Math.ceil(guestsCount/3);
    const totalRooms = Math.max(rooms, minRooms);
    let rate = 0;
    switch(updated.roomType){ case "Single": rate=800; break; case "Double": rate=1200; break; case "Suite": rate=1800; break; default: rate=0; }
    return days>0 ? days*rate*totalRooms : 0;
  };

  // --- Availability check ---
  const checkAvailability = async (checkInDate, checkOutDate, roomsRequired) => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const bookings = await res.json();
    const requestedRooms = parseInt(roomsRequired);
    const occupiedRooms = bookings.reduce((sum,b)=>{
      const existingCheckIn = new Date(`${b.checkInDate}T${b.checkInTime}`);
      const existingCheckOut = new Date(`${b.checkOutDate}T${b.checkOutTime}`);
      const reqCheckIn = new Date(`${checkInDate}T00:00`);
      const reqCheckOut = new Date(`${checkOutDate}T23:59`);
      if(reqCheckOut >= existingCheckIn && reqCheckIn <= existingCheckOut){
        return sum + (parseInt(b.roomsRequired)||1);
      }
      return sum;
    },0);
    const totalRooms = 20;
    return totalRooms - occupiedRooms >= requestedRooms;
  };

  // --- Handle changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = {...formData, [name]: value};
    setFormData(updated);
    if(["roomType","checkInDate","checkOutDate","roomsRequired"].includes(name)){
      setAmount(calculateAmount(updated));
    }
  };

  const handleGuestChange = (i, field, value) => {
    const guests = [...formData.guests]; guests[i][field]=value;
    setFormData({...formData, guests}); setAmount(calculateAmount({...formData, guests}));
  };
  const addGuest = ()=>setFormData({...formData, guests:[...formData.guests, {name:"",age:"",address:"",email:"",phone:"",purpose:""}]});
  const removeGuest = (i)=>{ const guests=formData.guests.filter((_,idx)=>idx!==i); setFormData({...formData, guests}); setAmount(calculateAmount({...formData, guests})); };

  // --- Submit Booking ---
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.fullName || !formData.email || !formData.phone || !formData.roomType || !formData.checkInDate || !formData.checkOutDate){
      setError("⚠️ Please fill all required fields."); return;
    }
    const available = await checkAvailability(formData.checkInDate, formData.checkOutDate, formData.roomsRequired);
    if(!available){ alert("⚠️ Rooms not available for selected dates"); return; }

    const bookingData = {...formData, amount, createdAt:new Date().toISOString()};
    try{
      const res = await fetch("http://localhost:5000/api/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(bookingData)});
      const result = await res.json();
      result.success ? navigate(`/success?id=${result.id}`) : alert("❌ Booking Failed");
    }catch{ alert("⚠️ Server Error"); }
  };

  const upiString = amount>0 ? `upi://pay?pa=9525594357@paytm&pn=GuestHouse&am=${amount}&cu=INR` : "";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Aryabhatta University – Guest House Booking</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic fields */}
        <input style={styles.input} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required/>
        <input style={styles.input} name="email" value={formData.email} onChange={handleChange} placeholder="Email" required/>
        <input style={styles.input} name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required/>
        <input style={styles.input} name="address" value={formData.address} onChange={handleChange} placeholder="Address"/>
        <input style={styles.input} name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose of Visit"/>
        <select style={styles.input} name="roomType" value={formData.roomType} onChange={handleChange} required>
          <option value="">Select Room Type</option><option value="Single">Single</option><option value="Double">Double</option><option value="Suite">Suite</option>
        </select>
        <input style={styles.input} type="number" name="roomsRequired" value={formData.roomsRequired} onChange={handleChange} placeholder="Rooms Required" min="1"/>
        <input style={styles.input} type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required/>
        <input style={styles.input} type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} required/>
        <input style={styles.input} type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required/>
        <input style={styles.input} type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} required/>

        {/* Guests */}
        <h4>Additional Guests</h4>
        {formData.guests.map((g,i)=>(
          <div key={i} style={styles.guestBox}>
            <input placeholder="Name" value={g.name} onChange={e=>handleGuestChange(i,"name",e.target.value)} />
            <input placeholder="Email" value={g.email} onChange={e=>handleGuestChange(i,"email",e.target.value)} />
            <input placeholder="Phone" value={g.phone} onChange={e=>handleGuestChange(i,"phone",e.target.value)} />
            <input placeholder="Age" value={g.age} onChange={e=>handleGuestChange(i,"age",e.target.value)} />
            <button type="button" onClick={()=>removeGuest(i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addGuest}>Add Guest</button>

        <h3>Total Amount: ₹{amount}</h3>
        {upiString && <div><h4>Pay via UPI</h4><QRCodeSVG value={upiString} size={120}/></div>}

        {error && <p style={{color:"red"}}>{error}</p>}
        <button type="submit" style={styles.submit}>Book Now</button>
      </form>
    </div>
  );
}

const styles = {
  container:{padding:"20px",maxWidth:"700px",margin:"auto"},
  title:{textAlign:"center",color:"#003366"},
  form:{display:"flex",flexDirection:"column",gap:"10px"},
  input:{padding:"10px",fontSize:"16px",borderRadius:"6px",border:"1px solid #ccc"},
  guestBox:{display:"flex",gap:"5px",flexWrap:"wrap",alignItems:"center"},
  submit:{padding:"12px",background:"#003366",color:"white",fontSize:"16px",border:"none",borderRadius:"6px",cursor:"pointer"}
};

export default Booking;
