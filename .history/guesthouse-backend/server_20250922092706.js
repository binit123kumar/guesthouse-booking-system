const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid"); // To generate unique temporary IDs
const nodemailer = require("nodemailer"); // For sending emails

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

// 📧 Helper function to send email
async function sendEmail(to, subject, html, attachments = []) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service
    auth: {
      user: "your-email@gmail.com", // Your email
      pass: "your-password", // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to,
    subject,
    html,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// 📄 Helper to generate PDF
function generateBookingPdf(booking, reason = null) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    const logoPath = path.join(__dirname, "university-logo.png");
    if (fs.existsSync(logoPath)) doc.image(logoPath, 40, 30, { width: 70 });

    doc.fontSize(20).text("Aryabhatta Knowledge University", 130, 40);
    doc.fontSize(14).text("Guest House Booking Details", 130, 70);
    doc.moveDown(2);

    if (reason) {
      doc.fontSize(16).fillColor('red').text("BOOKING DECLINED", { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(12).fillColor('black').text(`Reason for Decline: ${reason}`);
      doc.moveDown(1);
    } else {
      doc.fontSize(16).fillColor('green').text("BOOKING CONFIRMED", { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(12).fillColor('black').text(`Booking ID: ${booking.bookingId}`);
      doc.moveDown(1);
    }
    
    doc.fontSize(12).text(`Guest Name: ${booking.fullName}`);
    doc.text(`Email: ${booking.email}`);
    doc.text(`Phone: ${booking.phone}`);
    doc.text(`Room Type: ${booking.roomType}`);
    doc.text(`Rooms Required: ${booking.roomsRequired}`);
    doc.text(`Check-In: ${booking.checkInDate}`);
    doc.text(`Check-Out: ${booking.checkOutDate}`);
    doc.text(`Amount: ₹ ${booking.amount}`);
    if (booking.roomNumber) {
        doc.text(`Room Number: ${booking.roomNumber}`);
    }

    doc.end();
  });
}

// ✅ GET All Bookings (Updated to use status)
app.get("/api/bookings", (req, res) => {
  const bookings = readBookings();
  res.json(bookings);
});

// ✅ GET Pending Bookings for Admin Dashboard
app.get("/api/bookings/pending", (req, res) => {
  const bookings = readBookings();
  const pendingBookings = bookings.filter(b => b.status === "pending");
  res.json(pendingBookings);
});

// ✅ POST New Booking (Updated with tempId and status)
app.post("/api/bookings", (req, res) => {
  const bookings = readBookings();
  const newBooking = {
    ...req.body,
    tempId: uuidv4(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  res.json({ success: true, message: "Booking request received. Awaiting admin approval.", tempId: newBooking.tempId });
});

// ✅ POST Admin Approve Booking
app.post("/api/bookings/approve", async (req, res) => {
  const { tempId, roomNumber } = req.body;
  if (!tempId || !roomNumber) {
    return res.status(400).json({ message: "Temporary ID and room number required." });
  }
  const bookings = readBookings();
  const bookingIndex = bookings.findIndex(b => b.tempId === tempId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const booking = bookings[bookingIndex];
  booking.status = "approved";
  booking.bookingId = Math.random().toString(36).substring(2, 10).toUpperCase(); // Example permanent ID
  booking.roomNumber = roomNumber;
  writeBookings(bookings);

  try {
    const pdfBuffer = await generateBookingPdf(booking);
    await sendEmail(
      booking.email,
      "Booking Confirmed - Aryabhatta Guest House",
      `Dear ${booking.fullName},<br/><br/>Your booking has been approved. Your booking ID is <b>${booking.bookingId}</b> and your room number is <b>${booking.roomNumber}</b>. Please find the attached PDF with all the details.`,
      [{ filename: `booking-${booking.bookingId}.pdf`, content: pdfBuffer }]
    );
    res.json({ success: true, message: "Booking approved and confirmation sent." });
  } catch (error) {
    console.error("Approval process failed:", error);
    res.status(500).json({ message: "Approval failed. Please check server logs." });
  }
});

// ✅ POST Admin Decline Booking
app.post("/api/bookings/decline", async (req, res) => {
  const { tempId, reason } = req.body;
  if (!tempId || !reason) {
    return res.status(400).json({ message: "Temporary ID and reason required." });
  }
  const bookings = readBookings();
  const bookingIndex = bookings.findIndex(b => b.tempId === tempId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const booking = bookings[bookingIndex];
  booking.status = "declined";
  booking.declineReason = reason;
  writeBookings(bookings);

  try {
    const pdfBuffer = await generateBookingPdf(booking, reason);
    await sendEmail(
      booking.email,
      "Booking Declined - Aryabhatta Guest House",
      `Dear ${booking.fullName},<br/><br/>We regret to inform you that your booking has been declined. Please find the attached PDF for more details.`,
      [{ filename: `decline-notice.pdf`, content: pdfBuffer }]
    );
    res.json({ success: true, message: "Booking declined and notification sent." });
  } catch (error) {
    console.error("Decline process failed:", error);
    res.status(500).json({ message: "Decline failed. Please check server logs." });
  }
});


// Existing Invoice API
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
  doc.text(`Booking Status: ${booking.status}`);
  if (booking.bookingId) doc.text(`Booking ID: ${booking.bookingId}`);
  if (booking.roomNumber) doc.text(`Room Number: ${booking.roomNumber}`);
  if (booking.declineReason) doc.text(`Decline Reason: ${booking.declineReason}`);

  doc.end();
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
    // Only count approved bookings that overlap
    if (b.status !== "approved" || b.roomType !== roomType) return sum;

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
    // Only count approved bookings
    if (b.status !== "approved") return;
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

  const activeBookings = bookings.filter(b => b.status === "approved" && new Date(b.checkOutDate) >= today);
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const declinedBookings = bookings.filter(b => b.status === "declined").length;
  const totalBookings = bookings.length;
  const availableRooms = 20 - activeBookings.reduce((sum, b) => sum + (parseInt(b.roomsRequired) || 1), 0);
  const onlinePayments = bookings.filter(b => b.paymentStatus?.toLowerCase() === "online").length;
  const cashPayments = bookings.filter(b => b.paymentStatus?.toLowerCase() === "cash").length;

  res.json({
    totalBookings,
    pendingBookings,
    declinedBookings,
    availableRooms: availableRooms < 0 ? 0 : availableRooms,
    onlinePayments,
    cashPayments
  });
});

// ✅ Serve React frontend
const buildPath = path.join(__dirname, "../guesthouse-frontend/build");
app.use(express.static(buildPath));
app.get(/.*/, (req, res) => res.sendFile(path.join(buildPath, "index.html")));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));