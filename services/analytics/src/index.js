const express = require('express');
const { Booking, Trip, Payment, Bus, Route } = require('../../../shared/models');
const router = express.Router();

// Revenue analytics
router.get('/analytics/revenue', async (req, res) => {
  try {
    const { startDate, endDate, routeId, busId } = req.query;
    
    const query = { paymentStatus: 'success' };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('tripId')
      .populate('userId');
    
    let filteredBookings = bookings;
    if (routeId) {
      filteredBookings = bookings.filter(b => b.tripId.routeId.toString() === routeId);
    }
    if (busId) {
      filteredBookings = bookings.filter(b => b.tripId.busId.toString() === busId);
    }
    
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.finalAmount, 0);
    const totalBookings = filteredBookings.length;
    const avgBookingValue = totalRevenue / totalBookings || 0;
    
    const dailyRevenue = {};
    filteredBookings.forEach(booking => {
      const date = booking.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + booking.finalAmount;
    });
    
    res.json({
      totalRevenue,
      totalBookings,
      avgBookingValue,
      dailyRevenue,
      cancellations: filteredBookings.filter(b => b.bookingStatus === 'cancelled').length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Booking analytics
router.get('/analytics/bookings', async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly
    
    const bookings = await Booking.find({});
    
    const statusCounts = {
      confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
      cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
      completed: bookings.filter(b => b.bookingStatus === 'completed').length
    };
    
    const paymentCounts = {
      success: bookings.filter(b => b.paymentStatus === 'success').length,
      pending: bookings.filter(b => b.paymentStatus === 'pending').length,
      failed: bookings.filter(b => b.paymentStatus === 'failed').length
    };
    
    const popularRoutes = await Booking.aggregate([
      { $lookup: { from: 'trips', localField: 'tripId', foreignField: '_id', as: 'trip' } },
      { $lookup: { from: 'routes', localField: 'trip.routeId', foreignField: '_id', as: 'route' } },
      { $group: { _id: '$route.source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const popularTimes = {};
    bookings.forEach(booking => {
      const hour = new Date(booking.createdAt).getHours();
      popularTimes[hour] = (popularTimes[hour] || 0) + 1;
    });
    
    res.json({ statusCounts, paymentCounts, popularRoutes, popularTimes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bus utilization report
router.get('/analytics/bus-utilization', async (req, res) => {
  try {
    const buses = await Bus.find({});
    const utilizations = [];
    
    for (const bus of buses) {
      const trips = await Trip.find({ busId: bus._id });
      const bookings = await Booking.find({ tripId: { $in: trips } });
      
      const utilization = {
        busId: bus._id,
        busName: bus.busName,
        totalTrips: trips.length,
        totalBookings: bookings.length,
        occupancyRate: (bookings.length / (trips.length * bus.capacity) * 100).toFixed(2),
        revenue: bookings.reduce((sum, b) => sum + b.finalAmount, 0)
      };
      
      utilizations.push(utilization);
    }
    
    res.json(utilizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AI Predictions
router.get('/analytics/predictions', async (req, res) => {
  try {
    const { routeId, date } = req.query;
    
    // Mock demand prediction
    const prediction = {
      expectedDemand: Math.floor(Math.random() * 100) + 50,
      recommendedPrice: Math.random() * 200 + 500,
      peakHours: [8, 18, 20],
      occupancyPrediction: '75%',
      demandTrend: 'increasing'
    };
    
    // Fraud detection
    const fraudDetection = {
      suspiciousBookings: Math.floor(Math.random() * 5),
      flaggedPatterns: [],
      riskScore: Math.random()
    };
    
    res.json({ prediction, fraudDetection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer analytics
router.get('/analytics/customers', async (req, res) => {
  try {
    const customers = await Booking.aggregate([
      { $group: { _id: '$userId', totalBookings: { $sum: 1 }, totalSpent: { $sum: '$finalAmount' } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 100 }
    ]);
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;