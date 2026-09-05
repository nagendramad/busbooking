const express = require('express');
const mongoose = require('mongoose');
const { Bus, Route, Trip, Booking } = require('../shared/models');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Search buses
router.get('/buses', async (req, res) => {
  try {
    const { source, destination, date, busType, acType, minPrice, maxPrice, sortBy } = req.query;
    
    const routeQuery = {};
    if (source) routeQuery.source = new RegExp(source, 'i');
    if (destination) routeQuery.destination = new RegExp(destination, 'i');

    const routes = await Route.find(routeQuery);
    const routeIds = routes.map(r => r._id);

    let tripQuery = { routeId: { $in: routeIds } };
    
    if (date) {
      const searchDate = new Date(date);
      tripQuery.departureTime = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const trips = await Trip.find(tripQuery)
      .populate('busId')
      .populate('routeId')
      .sort(sortBy === 'price_asc' ? { price: 1 } : sortBy === 'price_desc' ? { price: -1 } : { departureTime: 1 });

    let results = trips.filter(trip => {
      if (busType && trip.busId.busType !== busType) return false;
      if (minPrice && trip.price < Number(minPrice)) return false;
      if (maxPrice && trip.price > Number(maxPrice)) return false;
      return true;
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bus details
router.get('/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create route
router.post('/routes', async (req, res) => {
  try {
    const { source, destination, distance, estimatedDuration, stops } = req.body;
    
    const route = new Route({
      source,
      destination,
      distance,
      estimatedDuration,
      stops
    });
    
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bus
router.post('/buses', async (req, res) => {
  try {
    const { busName, busType, amenities, capacity } = req.body;
    
    // Generate seat layout
    const seatLayout = {
      lower: [],
      upper: []
    };
    
    for (let i = 1; i <= Math.floor(capacity / 2); i++) {
      seatLayout.lower.push({
        seatNumber: `L${i}`,
        type: 'lower',
        isAvailable: true
      });
    }
    
    for (let i = 1; i <= Math.ceil(capacity / 2); i++) {
      seatLayout.upper.push({
        seatNumber: `U${i}`,
        type: 'upper',
        isAvailable: true
      });
    }
    
    const bus = new Bus({
      busName,
      busType,
      amenities,
      capacity,
      seatLayout
    });
    
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create trip
router.post('/trips', async (req, res) => {
  try {
    const { busId, routeId, departureTime, arrivalTime, price, driverId } = req.body;
    
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    
    const trip = new Trip({
      busId,
      routeId,
      departureTime,
      arrivalTime,
      price,
      availableSeats: bus.capacity,
      driverId
    });
    
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lock seats during booking
router.post('/seats/lock', async (req, res) => {
  try {
    const { tripId, seats } = req.body;
    
    // Lock seats logic (would store in Redis in production)
    const lockKey = `seat_lock:${tripId}`;
    const lockExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    res.json({ lockKey, expiresAt: lockExpiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book ticket
router.post('/booking', async (req, res) => {
  try {
    const { userId, tripId, seats, passengers, totalAmount, discount, couponCode } = req.body;
    
    const trip = await Trip.findById(tripId).populate('busId');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    // Gender validation
    for (const seat of seats) {
      const passenger = passengers.find(p => p.seatNumber === seat.seatNumber);
      if (passenger && seat.gender !== passenger.gender) {
        return res.status(400).json({ message: 'Gender mismatch for seat' });
      }
    }
    
    const finalAmount = totalAmount - (discount || 0);
    const bookingId = `BK${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(bookingId);
    
    const booking = new Booking({
      userId,
      tripId,
      seats,
      passengers,
      totalAmount,
      discount: discount || 0,
      finalAmount,
      bookingId,
      qrCode,
      paymentStatus: 'pending'
    });
    
    await booking.save();
    
    // Update available seats
    trip.availableSeats -= seats.length;
    await trip.save();
    
    res.status(201).json({ bookingId, qrCode, finalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking
router.get('/ticket/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id })
      .populate('tripId')
      .populate('userId');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.post('/booking/cancel', async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findOne({ bookingId }).populate('tripId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const cancellationPolicy = {
      fullRefundBefore24h: true,
      partialRefundBefore6h: true,
      noRefundAfter: true
    };
    
    const trip = booking.tripId;
    const hoursBeforeDeparture = (trip.departureTime - new Date()) / (1000 * 60 * 60);
    
    let refundAmount = 0;
    if (hoursBeforeDeparture > 24) {
      refundAmount = booking.finalAmount;
    } else if (hoursBeforeDeparture > 6) {
      refundAmount = booking.finalAmount * 0.5;
    }
    
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = refundAmount > 0 ? 'refunded' : 'success';
    await booking.save();
    
    // Restore seats
    trip.availableSeats += booking.seats.length;
    await trip.save();
    
    res.json({ message: 'Booking cancelled', refundAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking history
router.get('/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('tripId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;