const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); 

const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid"); 
const nodemailer = require("nodemailer"); 

const mongoose = require("mongoose");        
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcryptjs");
const { protectAdminRoute } = require("./routes/middleware/auth.js"); 

const User = require("./models/User");       
const Booking = require("./models/Booking"); 

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_STRONG_SECRET_KEY_12345"; 

const app = express();
const PORT = 5000;

const MONGO_URI = "mongodb://localhost:27017/guesthouseDB"; 
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

async function sendEmail(to, subject, html, attachments = []) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", 
      pass: "your-password", 
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

app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: new RegExp('^'+email+'$', "i") }); 
        
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Invalid credentials or not an admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials or not an admin." });
        }

        const payload = {
            id: user._id,
            role: user.role 
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h', 
        });

        return res.json({ success: true, message: "Login successful!", token });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});


app.get("/api/bookings", protectAdminRoute, async (req, res) => { 
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

const buildPath = path.join(__dirname, "../guesthouse-frontend/build");
app.use(express.static(buildPath));
app.get(/.*/, (req, res) => res.sendFile(path.join(buildPath, "index.html")));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));