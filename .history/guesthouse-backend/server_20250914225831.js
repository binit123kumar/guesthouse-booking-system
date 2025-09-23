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

// ✅ GET All Bookings
app.get("/api/bookings", (req, res) => {
  const data = fs.existsSync(filePath) ? fs.readFileSync(filePath) : "[]";
  res.send(JSON.parse(data));
});

// ✅ POST New Booking with Validation
app.post("/api/bookings", (req, res) => {
  const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
  const newBooking = req.body;

  if (
    !newBooking.fullName ||
    !newBooking.email ||
    !newBooking.phone ||
    !newBooking.roomType ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return res
      .status(400)
      .send({ success: false, message: "⚠️ Please fill all required fields." });
  }

  const rooms = parseInt(newBooking.roomsRequired) || 1;
  const maxAllowedGuests = rooms * 3;
  const totalPersons = 1 + (newBooking.guests?.length || 0);
  if (totalPersons > maxAllowedGuests) {
    return res.status(400).send({
      success: false,
      message: `⚠️ Only ${maxAllowedGuests} persons allowed for ${rooms} room(s).`,
    });
  }

  const checkIn = new Date(`${newBooking.checkInDate}T${newBooking.checkInTime}`);
  const checkOut = new Date(`${newBooking.checkOutDate}T${newBooking.checkOutTime}`);
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

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

  existingData.push(newBooking);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  res.send({
    success: true,
    message: "Booking saved successfully",
    id: existingData.length - 1,
  });
});

// ✅ Unified Room Availability API (RoomType + Dates)
app.post("/api/rooms/check-availability", (req, res) => {
  const { roomType, checkInDate, checkOutDate } = req.body;

  if (!roomType || !checkInDate || !checkOutDate) {
    return res.status(400).json({ success: false, message: "⚠️ RoomType, Check-In and Check-Out required" });
  }

  // Total rooms available per type
  const totalRoomsPerType = { Single: 10, Double: 5, Suite: 3 };

  const bookings = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Count booked rooms of this type overlapping with given date range
  const bookedRooms = bookings.reduce((sum, b) => {
    if (b.roomType !== roomType) return sum;

    const existingCheckIn = new Date(b.checkInDate);
    const existingCheckOut = new Date(b.checkOutDate);

    // ✅ overlap check
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

// ✅ Booking Summary API
app.get("/api/bookings/summary", (req, res) => {
  const bookings = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
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

// ✅ Admin Dashboard Stats API
app.get("/api/admin/dashboard", (req, res) => {
  const bookings = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
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
  const bookings = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
  const booking = bookings[id];
  if (!booking) return res.status(404).send({ error: "Booking not found" });

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${id}.pdf`);
  doc.pipe(res);

  const logoPath = path.join(__dirname, "university-logo.png");
  doc.save().rect(20, 20, 572, 752).lineWidth(2).strokeColor("#003366").stroke().restore();
  if (fs.existsSync(logoPath)) doc.opacity(0.08).image(logoPath, 180, 340, { width: 250 }).opacity(1);
  doc.save().rect(20, 20, 572, 90).fill("#003366").restore();
  if (fs.existsSync(logoPath)) doc.image(logoPath, 40, 30, { width: 70 });
  doc.fillColor("white").fontSize(24).text("Aryabhatta Knowledge University", 130, 40);
  doc.fontSize(14).text("Guest House Booking Invoice", 130, 65);
  doc.fillColor("#003366").moveTo(40, 130).lineTo(560, 130).stroke();

  const left = 40;
  const columnWidth = 200;
  let y = 150;

  const details = [
    ["Guest Name", booking.fullName],
    ["Address", booking.address],
    ["Email", booking.email],
    ["Phone", booking.phone],
    ["Purpose of Visit", booking.purpose],
    ["Room Type", booking.roomType],
    ["Rooms Required", booking.roomsRequired],
    ["Check-In", `${booking.checkInDate} ${booking.checkInTime}`],
    ["Check-Out", `${booking.checkOutDate} ${booking.checkOutTime}`],
    ["Category", booking.category],
    ["Payment Status", booking.paymentStatus],
    ["Amount Paid", `INR ${booking.amount}`],
    ["Booking Date", new Date(booking.createdAt).toLocaleString() ],
  ];

  details.forEach(([label, value], i) => {
    const bg = i % 2 === 0 ? "#f0f4f8" : "#ffffff";
    doc.save().rect(left, y - 2, 500, 25).fill(bg).restore();
    doc.fillColor("#003366").font("Helvetica-Bold").fontSize(12).text(label, left + 10, y + 5);
    doc.fillColor("black").font("Helvetica").text(value || "-", left + columnWidth + 20, y + 5);
    y += 25;
  });

  if (booking.guests && booking.guests.length > 0) {
    y += 30;
    doc.fontSize(14).fillColor("#003366").text("Additional Guests", left, y);
    y += 20;
    doc.fontSize(11).fillColor("white").save().rect(left, y - 2, 500, 20).fill("#003366").restore();
    doc.fillColor("white").font("Helvetica-Bold")
      .text("Name", left + 5, y + 3)
      .text("Email", left + 120, y + 3)
      .text("Phone", left + 260, y + 3)
      .text("Age", left + 380, y + 3);
    y += 22;

    booking.guests.forEach((g, i) => {
      const bg = i % 2 === 0 ? "#f9f9f9" : "#ffffff";
      doc.save().rect(left, y - 2, 500, 20).fill(bg).restore();
      doc.fillColor("black").font("Helvetica").fontSize(10)
        .text(g.name || "", left + 5, y + 3)
        .text(g.email || "", left + 120, y + 3)
        .text(g.phone || "", left + 260, y + 3)
        .text(g.age || "", left + 380, y + 3);
      y += 22;
    });
  }

  const signY = y + 40;
  doc.fontSize(12).fillColor("black").text("Authorized Signature:", left, signY);
  doc.moveTo(left + 150, signY + 15).lineTo(left + 280, signY + 15).strokeColor("#333").stroke();

  doc.moveTo(40, signY + 60).lineTo(560, signY + 60).strokeColor("#999").stroke();
  doc.fontSize(12).fillColor("#003366").text("Thank you for booking with Aryabhatta Knowledge University!", 40, signY + 70, { align: "center" });
  doc.fontSize(10).fillColor("black").text("📍 Address: Aryabhatta Knowledge University, Patna, Bihar", 40, signY + 90, { align: "center" });
  doc.text("☎️ Contact: +91 9525594357   |   ✉️ Email: info@aku.ac.in", 40, signY + 105, { align: "center" });

  doc.end();
});

// ✅ Serve React frontend
const buildPath = path.join(__dirname, "../guesthouse-frontend/build");
app.use(express.static(buildPath));
app.get(/.*/, (req, res) => res.sendFile(path.join(buildPath, "index.html")));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
