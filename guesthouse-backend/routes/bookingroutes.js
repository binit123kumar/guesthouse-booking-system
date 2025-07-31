const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const bookingsFile = path.join(__dirname, "../db/bookings.json");

// Ensure the bookings file exists
if (!fs.existsSync(bookingsFile)) {
  fs.writeFileSync(bookingsFile, "[]");
}

// 🔍 GET all bookings
router.get("/", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(bookingsFile, "utf-8"));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read bookings." });
  }
});

// ✍️ POST a new booking
router.post("/", (req, res) => {
  try {
    const newBooking = req.body;
    const data = JSON.parse(fs.readFileSync(bookingsFile, "utf-8"));
    data.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(data, null, 2));
    res.status(201).json({ message: "Booking saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save booking." });
  }
});

module.exports = router;
