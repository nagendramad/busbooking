const express = require('express');
const { Payment, Booking } = require('../../../shared/models');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

// Initialize payment
router.post('/payment/initiate', async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;
    
    const booking = await Booking.findOne({ bookingId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
    
    const payment = new Payment({
      bookingId: booking._id,
      paymentMethod,
      transactionId: order.id,
      amount,
      gateway: 'razorpay'
    });
    
    await payment.save();
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.post('/payment/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    
    const isValid = generatedSignature === signature;
    
    if (isValid) {
      const payment = await Payment.findOne({ transactionId: orderId });
      if (payment) {
        payment.status = 'success';
        payment.paymentMethod = 'razorpay';
        await payment.save();
        
        const booking = await Booking.findById(payment.bookingId);
        if (booking) {
          booking.paymentStatus = 'success';
          await booking.save();
        }
      }
      
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process refund
router.post('/payment/refund', async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    
    const refund = await razorpay.payments.refund(payment.transactionId, {
      amount: amount * 100
    });
    
    payment.status = 'refunded';
    await payment.save();
    
    res.json({ message: 'Refund processed', refundId: refund.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment status
router.get('/payment/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('bookingId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;