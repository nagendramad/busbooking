const express = require('express');
const { Trip, Booking } = require('../../../shared/models');
const router = express.Router();

// Update bus location
router.post('/location/update', async (req, res) => {
  try {
    const { tripId, latitude, longitude, speed, heading } = req.body;
    
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    // Store location in Redis for real-time access (mock - store in memory)
    const locationData = {
      tripId,
      latitude,
      longitude,
      speed,
      heading,
      timestamp: new Date()
    };
    
    console.log(`Location update for trip ${tripId}: ${latitude}, ${longitude}`);
    
    res.json({ message: 'Location updated', location: locationData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bus location
router.get('/location/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    // Mock location - in production, fetch from Redis
    const location = {
      latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
      speed: Math.floor(Math.random() * 60),
      heading: Math.floor(Math.random() * 360),
      lastUpdate: new Date()
    };
    
    // Calculate ETA
    const ETA = {
      estimatedArrival: new Date(Date.now() + (Math.random() * 3600 * 1000)),
      remainingStops: Math.floor(Math.random() * 5),
      delayMinutes: trip.tripStatus === 'delayed' ? 15 : 0
    };
    
    res.json({ location, ETA });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get live tracking for customer
router.get('/track/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate('tripId');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const trip = booking.tripId;
    const tracking = {
      bookingId,
      busName: trip.busId?.busName || 'Bus',
      driverName: trip.driverId?.name || 'Driver',
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      estimatedArrival: new Date(Date.now() + Math.random() * 3600 * 1000),
      passengersOnBoard: Math.floor(Math.random() * trip.availableSeats)
    };
    
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update trip status (driver/operator)
router.put('/trip/:tripId/status', async (req, res) => {
  try {
    const { status, delayReason, newArrivalTime } = req.body;
    
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    trip.tripStatus = status;
    if (delayReason) trip.delayReason = delayReason;
    if (newArrivalTime) trip.arrivalTime = newArrivalTime;
    
    await trip.save();
    
    // Notify passengers of delay
    if (status === 'delayed') {
      console.log(`Delay notified for trip ${req.params.tripId}`);
    }
    
    res.json({ message: 'Trip status updated', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Traffic prediction
router.get('/traffic/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    // Mock traffic data
    const traffic = {
      congestionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      predictedDelay: Math.floor(Math.random() * 30),
      recommendedRoute: 'Take highway for faster travel',
      alternativeRoute: 'City route - longer but scenic'
    };
    
    res.json(traffic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;