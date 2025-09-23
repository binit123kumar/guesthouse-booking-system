const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "booking.json");

// ✅ Helper to read booking.json safely
function readBookings() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error parsing booking.json, resetting file.", err);
    fs.writeFileSync(filePath, "[]", "utf8");
    return [];
  }
}

// ✅ Helper to write booking.json
function writeBookings(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ✅ GET All Bookings
app.get("/api/bookings", (req, res) => {
  const bookings = readBookings();
  res.json(bookings);
});

// ✅ POST New Booking
app.post("/api/bookings", (req, res) => {
  const bookings = readBookings();
  const newBooking = req.body;

  if (
    !newBooking.fullName ||
    !newBooking.email ||
    !newBooking.phone ||
    !newBooking.roomType ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return res.status(400).json({ success: false, message: "⚠️ Please fill all required fields." });
  }

  const rooms = parseInt(newBooking.roomsRequired) || 1;
  const maxAllowedGuests = rooms * 3;
  const totalPersons = 1 + (newBooking.guests?.length || 0);
  if (totalPersons > maxAllowedGuests) {
    return res.status(400).json({
      success: false,
      message: `⚠️ Only ${maxAllowedGuests} persons allowed for ${rooms} room(s).`,
    });
  }

  const checkIn = new Date(`${newBooking.checkInDate}T${newBooking.checkInTime || "00:00"}`);
  const checkOut = new Date(`${newBooking.checkOutDate}T${newBooking.checkOutTime || "00:00"}`);
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;

  let rate = 0;
  switch (newBooking.roomType) {
    case "Single":
      rate = 800;
      break;
    case "Double":
      rate = 1200;
      break;
    case "Suite":
      rate = 1800;
      break;
  }

  newBooking.amount = rate * days * rooms;
  newBooking.createdAt = new Date().toISOString();

  bookings.push(newBooking);
  writeBookings(bookings);

  res.json({ success: true, message: "Booking saved successfully", id: bookings.length - 1 });
});

// ✅ Check Room Availability (POST)
app.post("/api/rooms/check-availability", (req, res) => {
  const { roomType, checkInDate, checkOutDate } = req.body;
  if (!roomType || !checkInDate || !checkOutDate) {
    return res.status(400).json({ success: false, message: "⚠️ RoomType, Check-In and Check-Out required" });
  }

  const totalRoomsPerType = { Single: 10, Double: 5, Suite: 3 };
  const bookings = readBookings();

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const bookedRooms = bookings.reduce((sum, b) => {
    if (b.roomType !== roomType) return sum;

    const existingCheckIn = new Date(b.checkInDate);
    const existingCheckOut = new Date(b.checkOutDate);

    // overlap check
    if (checkIn < existingCheckOut && checkOut > existingCheckIn) {
      return sum + (parseInt(b.roomsRequired) || 1);
    }
    return sum;
  }, 0);

  const availableRooms = (totalRoomsPerType[roomType] || 0) - bookedRooms;

  res.json({
    success: true,
    availableRooms,
    message:
      availableRooms > 0
        ? `${availableRooms} ${roomType} room(s) available`
        : `⚠️ No ${roomType} rooms available in selected dates`,
  });
});

// ✅ Booking Summary
app.get("/api/bookings/summary", (req, res) => {
  const bookings = readBookings();
  const today = new Date();
  const summary = { daily: {}, weekly: {}, monthly: {} };

  bookings.forEach((b) => {
    const checkIn = new Date(b.checkInDate);
    const checkOut = new Date(b.checkOutDate);
    if (isNaN(checkIn) || isNaN(checkOut)) return;

    if (checkOut < today) return;

    const rooms = parseInt(b.roomsRequired) || 1;
    for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
      const dayKey = d.toISOString().split("T")[0];
      summary.daily[dayKey] = (summary.daily[dayKey] || 0) + rooms;

      const weekNum = Math.ceil(d.getDate() / 7);
      const weekKey = `${d.getFullYear()}-W${weekNum}`;
      summary.weekly[weekKey] = (summary.weekly[weekKey] || 0) + rooms;

      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      summary.monthly[monthKey] = (summary.monthly[monthKey] || 0) + rooms;
    }
  });

  res.json(summary);
});

// ✅ Admin Dashboard
app.get("/api/admin/dashboard", (req, res) => {
  const bookings = readBookings();
  const today = new Date();

  const activeBookings = bookings.filter(b => new Date(b.checkOutDate) >= today);
  const totalBookings = bookings.length;
  const availableRooms = 20 - activeBookings.reduce((sum, b) => sum + (parseInt(b.roomsRequired) || 1), 0);
  const onlinePayments = bookings.filter(b => b.paymentStatus?.toLowerCase() === "online").length;
  const cashPayments = bookings.filter(b => b.paymentStatus?.toLowerCase() === "cash").length;

  res.json({
    totalBookings,
    availableRooms: availableRooms < 0 ? 0 : availableRooms,
    onlinePayments,
    cashPayments
  });
});

// ✅ Invoice API
app.get("/api/bookings/:id/invoice", (req, res) => {
  const id = parseInt(req.params.id);
  const bookings = readBookings();
  const booking = bookings[id];
  if (!booking) return res.status(404).send({ error: "Booking not found" });

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${id}.pdf`);
  doc.pipe(res);

  const logoPath = path.join(__dirname, "university-logo.png");
  if (fs.existsSync(logoPath)) doc.image(logoPath, 40, 30, { width: 70 });

  doc.fontSize(20).text("Aryabhatta Knowledge University", 130, 40);
  doc.fontSize(14).text("Guest House Booking Invoice", 130, 70);

  doc.fontSize(12).text(`Guest Name: ${booking.fullName}`, 40, 130);
  doc.text(`Email: ${booking.email}`);
  doc.text(`Phone: ${booking.phone}`);
  doc.text(`Room Type: ${booking.roomType}`);
  doc.text(`Rooms Required: ${booking.roomsRequired}`);
  doc.text(`Check-In: ${booking.checkInDate} ${booking.checkInTime || ""}`);
  doc.text(`Check-Out: ${booking.checkOutDate} ${booking.checkOutTime || ""}`);
  doc.text(`Amount Paid: INR ${booking.amount}`);

  doc.end();
});

// ✅ Serve React frontend
const buildPath = path.join(__dirname, "../guesthouse-frontend/build");
app.use(express.static(buildPath));
app.get(/.*/, (req, res) => res.sendFile(path.join(buildPath, "index.html")));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
