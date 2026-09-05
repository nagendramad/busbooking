const express = require('express');
const { Notification, Booking } = require('../../../shared/models');
const twilio = require('twilio');

const router = express.Router();

const client = twilio(
  process.env.TWILIO_SID || 'test_sid',
  process.env.TWILIO_AUTH_TOKEN || 'test_token'
);

// Send SMS
router.post('/sms/send', async (req, res) => {
  try {
    const { to, message, bookingId } = req.body;
    
    // Mock SMS sending
    console.log(`SMS to ${to}: ${message}`);
    
    const notification = new Notification({
      userId: req.user?.id,
      type: 'sms',
      message,
      bookingId,
      status: 'sent'
    });
    
    await notification.save();
    
    res.json({ message: 'SMS sent successfully', notificationId: notification._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send WhatsApp message
router.post('/whatsapp/send', async (req, res) => {
  try {
    const { to, message, bookingId } = req.body;
    
    // Mock WhatsApp sending
    console.log(`WhatsApp to ${to}: ${message}`);
    
    const notification = new Notification({
      userId: req.user?.id,
      type: 'whatsapp',
      message,
      bookingId,
      status: 'sent'
    });
    
    await notification.save();
    
    res.json({ message: 'WhatsApp message sent', notificationId: notification._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send email notification
router.post('/email/send', async (req, res) => {
  try {
    const { to, subject, message, bookingId } = req.body;
    
    // Mock email sending
    console.log(`Email to ${to}: ${subject} - ${message}`);
    
    const notification = new Notification({
      userId: req.user?.id,
      type: 'email',
      message,
      bookingId,
      status: 'sent'
    });
    
    await notification.save();
    
    res.json({ message: 'Email sent successfully', notificationId: notification._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send ticket confirmation
router.post('/send-confirmation', async (req, res) => {
  try {
    const { bookingId, phoneNumber, email } = req.body;
    
    const booking = await Booking.findOne({ bookingId })
      .populate('tripId')
      .populate('userId');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const message = `Your booking ${bookingId} is confirmed. Bus: ${booking.tripId.busId.busName}, Departure: ${booking.tripId.departureTime}`;
    
    // Send WhatsApp confirmation
    await fetch(`${process.env.NOTIFICATION_SERVICE_URL}/whatsapp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, message, bookingId })
    });
    
    // Send SMS confirmation
    await fetch(`${process.env.NOTIFICATION_SERVICE_URL}/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, message, bookingId })
    });
    
    res.json({ message: 'Confirmation sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;