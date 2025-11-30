// File: guesthouse-backend/models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    roomType: { type: String, required: true },
    roomsRequired: { type: Number, required: true, default: 1 },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    
    status: { 
        type: String, 
        default: 'pending', 
        enum: ['pending', 'approved', 'declined'] 
    },
    bookingId: { type: String },
    roomNumber: { type: String },
    declineReason: { type: String },
    tempId: { type: String, unique: true }, 
    paymentStatus: { type: String, enum: ['online', 'cash', 'pending'] }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);