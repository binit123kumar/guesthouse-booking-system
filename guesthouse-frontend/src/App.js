// File: guesthouse-frontend/src/App.js (Updated)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomeButton from './components/HomeButton';

// ✅ नया इंपोर्ट: ProtectedRoutes कंपोनेंट
import ProtectedRoutes from './ProtectedRoutes'; 

import Home from './pages/Home';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import About from './pages/About';
import Facilities from './pages/Facilities';
import Success from "./pages/Success";

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminPendingBookings from './pages/AdminPendingBookings';
import Availability from './pages/Availability';
import AdminDeclinedBookings from './pages/AdminDeclinedBookings'; 
import AdminOnline from './pages/AdminOnline';
import AdminCash from './pages/AdminCash';

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/success" element={<Success />} />

        {/* Public Admin Route for Login */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔒 Protected Admin Routes: अब ये रूट्स बिना लॉगिन टोकन के नहीं खुलेंगे */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/pending-bookings" element={<AdminPendingBookings />} />
          <Route path="/admin/declined-bookings" element={<AdminDeclinedBookings />} />
          <Route path="/admin/availability" element={<Availability />} />
          <Route path="/admin/online" element={<AdminOnline />} />
          <Route path="/admin/cash" element={<AdminCash />} />
        </Route>
      </Routes>
      <HomeButton />
    </Router>
  );
}

export default App;