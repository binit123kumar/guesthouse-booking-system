import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomeButton from './components/HomeButton';

import Home from './pages/Home';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import About from './pages/About';
import Facilities from './pages/Facilities';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminRooms from './pages/AdminRooms';
import AdminOnline from './pages/AdminOnline';
import AdminCash from './pages/AdminCash';
import BookingList from './pages/BookingList';
import Success from "./pages/Success";

// ✅ New Admin Components
import AdminPendingBookings from "./pages/AdminPendingBookings";
import Availability from "./pages/Availability";

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/online" element={<AdminOnline />} />
        <Route path="/admin/cash" element={<AdminCash />} />
        <Route path="/admin/bookinglist" element={<BookingList />} />
        <Route path="/success" element={<Success />} />

        {/* ✅ New Admin Routes for Pending and Availability pages */}
        <Route path="/admin/pending-bookings" element={<AdminPendingBookings />} />
        <Route path="/admin/availability" element={<Availability />} />
      </Routes>
      <HomeButton />
    </Router>
  );
}

export default App;