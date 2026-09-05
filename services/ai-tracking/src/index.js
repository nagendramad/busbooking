const express = require('express');
const { Booking, Trip } = require('../../../shared/models');
const router = express.Router();

// Initialize AI voice call
router.post('/ai/call/initiate', async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findOne({ bookingId })
      .populate('tripId')
      .populate('userId');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const callData = {
      to: booking.userId.phone,
      bookingId,
      message: `Reminder: Your bus ${booking.tripId.busId.busName} departs at ${booking.tripId.departureTime}`,
      boardingPoint: booking.passengers[0]?.boardingPoint || 'Main boarding point'
    };
    
    // Mock AI call initiation
    console.log(`AI Call to ${callData.to}: ${callData.message}`);
    
    res.json({ message: 'AI call initiated', callId: `call_${Date.now()}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Batch call reminders for upcoming trips (runs every hour)
router.post('/ai/call/batch-reminders', async (req, res) => {
  try {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const upcomingTrips = await Trip.find({
      departureTime: { $gte: now, $lte: twoHoursLater },
      tripStatus: 'scheduled'
    });
    
    const tripIds = upcomingTrips.map(t => t._id);
    const bookings = await Booking.find({ tripId: { $in: tripIds }, paymentStatus: 'success' })
      .populate('tripId')
      .populate('userId');
    
    const calls = [];
    for (const booking of bookings) {
      const callData = {
        to: booking.userId.phone,
        bookingId: booking.bookingId,
        message: `Reminder: Bus departs in 2 hours. Boarding: ${booking.tripId.routeId.source}`,
        language: booking.userId.preferredLanguage || 'en'
      };
      
      calls.push(callData);
      console.log(`Batch AI Call to ${callData.to}`);
    }
    
    res.json({ message: 'Batch calls initiated', count: calls.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AI chatbot endpoint
router.post('/chatbot', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // Simple rule-based responses (would integrate OpenAI in production)
    const responses = {
      'book': 'To book a ticket, please provide source, destination, and date.',
      'cancel': 'To cancel a booking, please provide your booking ID.',
      'track': 'Please provide your booking ID to track your bus.',
      'refund': 'Refunds are processed within 5-7 business days.',
      'default': 'I can help you with bookings, cancellations, tracking, and refunds. What do you need?'
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    for (const key in responses) {
      if (lowerMessage.includes(key)) {
        response = responses[key];
        break;
      }
    }
    
    res.json({ response, intent: Object.keys(responses).find(k => lowerMessage.includes(k)) || 'unknown' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Boarding assistance
router.post('/boarding-assistant', async (req, res) => {
  try {
    const { bookingId, boardingPoint } = req.body;
    
    const booking = await Booking.findOne({ bookingId })
      .populate('tripId')
      .populate('userId');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const assistance = {
      boardingPoint,
      landmark: 'Near City Mall',
      reportingTime: new Date(booking.tripId.departureTime.getTime() - 30 * 60 * 1000),
      contact: '+1-800-BUS-HELP'
    };
    
    res.json(assistance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;