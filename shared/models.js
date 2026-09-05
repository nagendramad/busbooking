// Shared MongoDB models
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  userType: { type: String, enum: ['customer', 'admin', 'operator', 'driver', 'support_agent'], default: 'customer' },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Bus Schema
const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busType: { type: String, enum: ['sleeper', 'seater', 'semi_sleeper'], required: true },
  amenities: [{ type: String }],
  capacity: { type: Number, required: true },
  seatLayout: {
    lower: [{ seatNumber: String, type: String, isAvailable: Boolean }],
    upper: [{ seatNumber: String, type: String, isAvailable: Boolean }]
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Route Schema
const routeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number },
  estimatedDuration: { type: Number },
  stops: [{ location: String, time: String }],
  createdAt: { type: Date, default: Date.now }
});

// Trip Schema
const tripSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  tripStatus: { type: String, enum: ['scheduled', 'started', 'completed', 'delayed', 'cancelled'], default: 'scheduled' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  seats: [{
    seatNumber: String,
    seatType: String,
    gender: String
  }],
  passengers: [{
    name: String,
    age: Number,
    gender: String,
    contact: String,
    emergencyContact: String,
    idProof: String
  }],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  bookingId: { type: String, unique: true },
  qrCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  paymentMethod: { type: String },
  transactionId: { type: String, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  gateway: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['whatsapp', 'sms', 'email'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'failed'], default: 'sent' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  createdAt: { type: Date, default: Date.now }
});

// Export models
module.exports = {
  User: mongoose.model('User', userSchema),
  Bus: mongoose.model('Bus', busSchema),
  Route: mongoose.model('Route', routeSchema),
  Trip: mongoose.model('Trip', tripSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Payment: mongoose.model('Payment', paymentSchema),
  Notification: mongoose.model('Notification', notificationSchema)
};