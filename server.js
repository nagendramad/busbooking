const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/operator', (req, res) => {
  res.sendFile(path.join(frontendPath, 'operator.html'));
});

// In-memory data store for demo
const mockData = {
  users: [],
  buses: [],
  routes: [],
  trips: [],
  bookings: [],
  payments: [],
  notifications: []
};

// Operator in-memory data
const operatorData = {
  buses: [
    {
      _id: 'bus1',
      busName: 'Express Travels',
      busType: 'sleeper',
      amenities: ['AC', 'WIFI', 'Charging'],
      capacity: 40,
      isActive: true,
      seatLayout: {
        rows: 10,
        columns: ['L', 'U', 'A'],
        layout: [
          { row: 1, seats: [{ code: 'L1', type: 'sleeper', status: 'available' }, { code: 'U1', type: 'sleeper', status: 'available' }, { code: 'A1', type: 'sleeper', status: 'available' }] },
          { row: 2, seats: [{ code: 'L2', type: 'sleeper', status: 'available' }, { code: 'U2', type: 'sleeper', status: 'available' }, { code: 'A2', type: 'sleeper', status: 'available' }] },
          { row: 3, seats: [{ code: 'L3', type: 'sleeper', status: 'booked' }, { code: 'U3', type: 'sleeper', status: 'available' }, { code: 'A3', type: 'sleeper', status: 'available' }] },
          { row: 4, seats: [{ code: 'L4', type: 'sleeper', status: 'available' }, { code: 'U4', type: 'sleeper', status: 'available' }, { code: 'A4', type: 'sleeper', status: 'available' }] },
          { row: 5, seats: [{ code: 'L5', type: 'sleeper', status: 'available' }, { code: 'U5', type: 'sleeper', status: 'booked' }, { code: 'A5', type: 'sleeper', status: 'available' }] },
          { row: 6, seats: [{ code: 'L6', type: 'sleeper', status: 'available' }, { code: 'U6', type: 'sleeper', status: 'available' }, { code: 'A6', type: 'sleeper', status: 'available' }] },
          { row: 7, seats: [{ code: 'L7', type: 'sleeper', status: 'available' }, { code: 'U7', type: 'sleeper', status: 'available' }, { code: 'A7', type: 'sleeper', status: 'available' }] },
          { row: 8, seats: [{ code: 'L8', type: 'sleeper', status: 'available' }, { code: 'U8', type: 'sleeper', status: 'available' }, { code: 'A8', type: 'sleeper', status: 'available' }] },
          { row: 9, seats: [{ code: 'L9', type: 'sleeper', status: 'available' }, { code: 'U9', type: 'sleeper', status: 'available' }, { code: 'A9', type: 'sleeper', status: 'available' }] },
          { row: 10, seats: [{ code: 'L10', type: 'sleeper', status: 'available' }, { code: 'U10', type: 'sleeper', status: 'available' }, { code: 'A10', type: 'sleeper', status: 'available' }] }
        ]
      }
    },
    {
      _id: 'bus2',
      busName: 'City Link',
      busType: 'seater',
      amenities: ['AC', 'Charging'],
      capacity: 36,
      isActive: true,
      seatLayout: {
        rows: 12,
        columns: ['L', 'R'],
        layout: [
          { row: 1, seats: [{ code: '1L', type: 'seater', status: 'available' }, { code: '1R', type: 'seater', status: 'available' }] },
          { row: 2, seats: [{ code: '2L', type: 'seater', status: 'available' }, { code: '2R', type: 'seater', status: 'available' }] },
          { row: 3, seats: [{ code: '3L', type: 'seater', status: 'booked' }, { code: '3R', type: 'seater', status: 'available' }] },
          { row: 4, seats: [{ code: '4L', type: 'seater', status: 'available' }, { code: '4R', type: 'seater', status: 'available' }] },
          { row: 5, seats: [{ code: '5L', type: 'seater', status: 'available' }, { code: '5R', type: 'seater', status: 'available' }] },
          { row: 6, seats: [{ code: '6L', type: 'seater', status: 'available' }, { code: '6R', type: 'seater', status: 'available' }] },
          { row: 7, seats: [{ code: '7L', type: 'seater', status: 'available' }, { code: '7R', type: 'seater', status: 'available' }] },
          { row: 8, seats: [{ code: '8L', type: 'seater', status: 'available' }, { code: '8R', type: 'seater', status: 'available' }] },
          { row: 9, seats: [{ code: '9L', type: 'seater', status: 'available' }, { code: '9R', type: 'seater', status: 'available' }] },
          { row: 10, seats: [{ code: '10L', type: 'seater', status: 'available' }, { code: '10R', type: 'seater', status: 'available' }] },
          { row: 11, seats: [{ code: '11L', type: 'seater', status: 'available' }, { code: '11R', type: 'seater', status: 'available' }] },
          { row: 12, seats: [{ code: '12L', type: 'seater', status: 'available' }, { code: '12R', type: 'seater', status: 'available' }] }
        ]
      }
    },
    {
      _id: 'bus3',
      busName: 'Royal Express',
      busType: 'sleeper',
      amenities: ['AC', 'WIFI', 'Blanket'],
      capacity: 32,
      isActive: true,
      seatLayout: {
        rows: 8,
        columns: ['L', 'U', 'A'],
        layout: [
          { row: 1, seats: [{ code: 'L1', type: 'sleeper', status: 'available' }, { code: 'U1', type: 'sleeper', status: 'available' }, { code: 'A1', type: 'sleeper', status: 'available' }] },
          { row: 2, seats: [{ code: 'L2', type: 'sleeper', status: 'available' }, { code: 'U2', type: 'sleeper', status: 'available' }, { code: 'A2', type: 'sleeper', status: 'available' }] },
          { row: 3, seats: [{ code: 'L3', type: 'sleeper', status: 'available' }, { code: 'U3', type: 'sleeper', status: 'available' }, { code: 'A3', type: 'sleeper', status: 'available' }] },
          { row: 4, seats: [{ code: 'L4', type: 'sleeper', status: 'available' }, { code: 'U4', type: 'sleeper', status: 'available' }, { code: 'A4', type: 'sleeper', status: 'available' }] },
          { row: 5, seats: [{ code: 'L5', type: 'sleeper', status: 'available' }, { code: 'U5', type: 'sleeper', status: 'available' }, { code: 'A5', type: 'sleeper', status: 'available' }] },
          { row: 6, seats: [{ code: 'L6', type: 'sleeper', status: 'available' }, { code: 'U6', type: 'sleeper', status: 'available' }, { code: 'A6', type: 'sleeper', status: 'available' }] },
          { row: 7, seats: [{ code: 'L7', type: 'sleeper', status: 'available' }, { code: 'U7', type: 'sleeper', status: 'available' }, { code: 'A7', type: 'sleeper', status: 'available' }] },
          { row: 8, seats: [{ code: 'L8', type: 'sleeper', status: 'available' }, { code: 'U8', type: 'sleeper', status: 'available' }, { code: 'A8', type: 'sleeper', status: 'available' }] }
        ]
      }
    },
    {
      _id: 'bus4',
      busName: 'GreenLine',
      busType: 'seater',
      amenities: ['AC'],
      capacity: 44,
      isActive: true,
      seatLayout: {
        rows: 11,
        columns: ['L', 'M', 'R'],
        layout: [
          { row: 1, seats: [{ code: '1L', type: 'seater', status: 'available' }, { code: '1M', type: 'seater', status: 'available' }, { code: '1R', type: 'seater', status: 'available' }] },
          { row: 2, seats: [{ code: '2L', type: 'seater', status: 'available' }, { code: '2M', type: 'seater', status: 'available' }, { code: '2R', type: 'seater', status: 'available' }] },
          { row: 3, seats: [{ code: '3L', type: 'seater', status: 'available' }, { code: '3M', type: 'seater', status: 'available' }, { code: '3R', type: 'seater', status: 'available' }] },
          { row: 4, seats: [{ code: '4L', type: 'seater', status: 'available' }, { code: '4M', type: 'seater', status: 'available' }, { code: '4R', type: 'seater', status: 'available' }] },
          { row: 5, seats: [{ code: '5L', type: 'seater', status: 'available' }, { code: '5M', type: 'seater', status: 'available' }, { code: '5R', type: 'seater', status: 'available' }] },
          { row: 6, seats: [{ code: '6L', type: 'seater', status: 'available' }, { code: '6M', type: 'seater', status: 'available' }, { code: '6R', type: 'seater', status: 'available' }] },
          { row: 7, seats: [{ code: '7L', type: 'seater', status: 'available' }, { code: '7M', type: 'seater', status: 'available' }, { code: '7R', type: 'seater', status: 'available' }] },
          { row: 8, seats: [{ code: '8L', type: 'seater', status: 'available' }, { code: '8M', type: 'seater', status: 'available' }, { code: '8R', type: 'seater', status: 'available' }] },
          { row: 9, seats: [{ code: '9L', type: 'seater', status: 'available' }, { code: '9M', type: 'seater', status: 'available' }, { code: '9R', type: 'seater', status: 'available' }] },
          { row: 10, seats: [{ code: '10L', type: 'seater', status: 'available' }, { code: '10M', type: 'seater', status: 'available' }, { code: '10R', type: 'seater', status: 'available' }] },
          { row: 11, seats: [{ code: '11L', type: 'seater', status: 'available' }, { code: '11M', type: 'seater', status: 'available' }, { code: '11R', type: 'seater', status: 'available' }] }
        ]
      }
    },
    {
      _id: 'bus5',
      busName: 'Night Rider',
      busType: 'sleeper',
      amenities: ['AC', 'Blanket'],
      capacity: 30,
      isActive: true,
      seatLayout: {
        rows: 10,
        columns: ['L', 'U', 'A'],
        layout: [
          { row: 1, seats: [{ code: 'L1', type: 'sleeper', status: 'available' }, { code: 'U1', type: 'sleeper', status: 'available' }, { code: 'A1', type: 'sleeper', status: 'available' }] },
          { row: 2, seats: [{ code: 'L2', type: 'sleeper', status: 'available' }, { code: 'U2', type: 'sleeper', status: 'available' }, { code: 'A2', type: 'sleeper', status: 'available' }] },
          { row: 3, seats: [{ code: 'L3', type: 'sleeper', status: 'available' }, { code: 'U3', type: 'sleeper', status: 'available' }, { code: 'A3', type: 'sleeper', status: 'available' }] },
          { row: 4, seats: [{ code: 'L4', type: 'sleeper', status: 'available' }, { code: 'U4', type: 'sleeper', status: 'available' }, { code: 'A4', type: 'sleeper', status: 'available' }] },
          { row: 5, seats: [{ code: 'L5', type: 'sleeper', status: 'available' }, { code: 'U5', type: 'sleeper', status: 'available' }, { code: 'A5', type: 'sleeper', status: 'available' }] },
          { row: 6, seats: [{ code: 'L6', type: 'sleeper', status: 'available' }, { code: 'U6', type: 'sleeper', status: 'available' }, { code: 'A6', type: 'sleeper', status: 'available' }] },
          { row: 7, seats: [{ code: 'L7', type: 'sleeper', status: 'available' }, { code: 'U7', type: 'sleeper', status: 'available' }, { code: 'A7', type: 'sleeper', status: 'available' }] },
          { row: 8, seats: [{ code: 'L8', type: 'sleeper', status: 'available' }, { code: 'U8', type: 'sleeper', status: 'available' }, { code: 'A8', type: 'sleeper', status: 'available' }] },
          { row: 9, seats: [{ code: 'L9', type: 'sleeper', status: 'available' }, { code: 'U9', type: 'sleeper', status: 'available' }, { code: 'A9', type: 'sleeper', status: 'available' }] },
          { row: 10, seats: [{ code: 'L10', type: 'sleeper', status: 'available' }, { code: 'U10', type: 'sleeper', status: 'available' }, { code: 'A10', type: 'sleeper', status: 'available' }] }
        ]
      }
    }
  ],
  routes: [
    { _id: 'route1', source: 'Bangalore', destination: 'Mumbai', distance: 980, estimatedDuration: 12, stops: [{ location: 'Pune', time: '04:00' }] },
    { _id: 'route2', source: 'Bangalore', destination: 'Chennai', distance: 360, estimatedDuration: 5, stops: [] },
    { _id: 'route3', source: 'Mumbai', destination: 'Pune', distance: 150, estimatedDuration: 3, stops: [] },
    { _id: 'route4', source: 'Delhi', destination: 'Jaipur', distance: 280, estimatedDuration: 5, stops: [{ location: 'Gurgaon', time: '01:30' }] },
    { _id: 'route5', source: 'Hyderabad', destination: 'Bangalore', distance: 570, estimatedDuration: 8, stops: [] }
  ],
  trips: [
    { _id: 'trip1', busId: 'bus1', routeId: 'route1', departureTime: new Date(Date.now() + 86400000).setHours(6, 0, 0, 0), arrivalTime: new Date(Date.now() + 86400000).setHours(18, 0, 0, 0), price: 500, availableSeats: 20, tripStatus: 'scheduled', days: ['Monday', 'Wednesday', 'Friday', 'Sunday'] },
    { _id: 'trip2', busId: 'bus2', routeId: 'route1', departureTime: new Date(Date.now() + 86400000).setHours(8, 30, 0, 0), arrivalTime: new Date(Date.now() + 86400000).setHours(20, 30, 0, 0), price: 450, availableSeats: 12, tripStatus: 'scheduled', days: ['Tuesday', 'Thursday', 'Saturday'] },
    { _id: 'trip3', busId: 'bus3', routeId: 'route1', departureTime: new Date(Date.now() + 86400000).setHours(11, 30, 0, 0), arrivalTime: new Date(Date.now() + 86400000).setHours(23, 30, 0, 0), price: 750, availableSeats: 8, tripStatus: 'scheduled', days: ['Daily'] },
    { _id: 'trip4', busId: 'bus4', routeId: 'route2', departureTime: new Date(Date.now() + 86400000).setHours(7, 0, 0, 0), arrivalTime: new Date(Date.now() + 86400000).setHours(12, 0, 0, 0), price: 400, availableSeats: 30, tripStatus: 'scheduled', days: ['Daily'] },
    { _id: 'trip5', busId: 'bus5', routeId: 'route4', departureTime: new Date(Date.now() + 86400000).setHours(22, 0, 0, 0), arrivalTime: new Date(Date.now() + 86400000 + 86400000).setHours(3, 0, 0, 0), price: 650, availableSeats: 15, tripStatus: 'scheduled', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }
  ]
};

// Auth routes
const authRoutes = express.Router();

authRoutes.post('/register', (req, res) => {
  const { name, phone, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`OTP sent: ${otp}`);
  res.status(201).json({ message: 'Registration successful. Please verify OTP.', otp });
});

authRoutes.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const mockToken = 'mock_token_' + Date.now();
  res.json({ token: mockToken, userType: 'customer', userId: 'user123' });
});

authRoutes.post('/verify-otp', (req, res) => {
  const mockToken = 'mock_token_' + Date.now();
  res.json({ message: 'Verification successful', token: mockToken, userType: 'customer' });
});

app.use('/api/auth', authRoutes);

// Booking routes
const bookingRoutes = express.Router();

bookingRoutes.get('/buses', (req, res) => {
  const { source, destination, date } = req.query;
  const baseDate = date ? new Date(date) : new Date(Date.now() + 86400000);
  const startOfDay = new Date(baseDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);

  const filteredTrips = operatorData.trips.filter(trip => {
    const tripDate = new Date(trip.departureTime);
    const matchesDate = tripDate >= startOfDay && tripDate <= endOfDay;
    if (!matchesDate) return false;

    const route = operatorData.routes.find(r => r._id === trip.routeId);
    if (!route) return false;

    const matchesRoute = (!source || route.source.toLowerCase().includes(source.toLowerCase())) &&
                         (!destination || route.destination.toLowerCase().includes(destination.toLowerCase()));
    return matchesRoute;
  });

  const results = filteredTrips.map(trip => {
    const bus = operatorData.buses.find(b => b._id === trip.busId);
    const route = operatorData.routes.find(r => r._id === trip.routeId);
    return {
      _id: trip._id,
      busId: bus ? { busName: bus.busName, busType: bus.busType, seatLayout: bus.seatLayout } : { busName: 'Unknown', busType: 'seater' },
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      price: trip.price,
      availableSeats: trip.availableSeats,
      routeId: route ? { source: route.source, destination: route.destination } : { source: source || 'Bangalore', destination: destination || 'Mumbai' }
    };
  });

  res.json(results);
});

bookingRoutes.post('/booking', (req, res) => {
  const { seats, passengers, totalAmount } = req.body;
  const bookingId = 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();
  res.status(201).json({ bookingId, finalAmount: totalAmount, qrCode: 'mock_qr_code' });
});

bookingRoutes.get('/ticket/:id', (req, res) => {
  res.json({
    bookingId: req.params.id,
    tripId: {
      busId: { busName: 'Express Travels' },
      routeId: { source: 'Bangalore', destination: 'Mumbai' },
      departureTime: new Date(Date.now() + 86400000),
      arrivalTime: new Date(Date.now() + 86400000 + 43200000)
    },
    passengers: [{ name: 'John Doe', age: 25, gender: 'male' }],
    seats: [{ seatNumber: 'L1' }],
    finalAmount: 500,
    qrCode: 'data:image/png;base64,mock_qr_code',
    paymentStatus: 'success',
    bookingStatus: 'confirmed'
  });
});

bookingRoutes.post('/booking/cancel', (req, res) => {
  res.json({ message: 'Booking cancelled', refundAmount: 250 });
});

app.use('/api/booking', bookingRoutes);

// Payment routes
const paymentRoutes = express.Router();

paymentRoutes.post('/payment/initiate', (req, res) => {
  res.json({ orderId: 'order_' + Date.now(), amount: 50000, currency: 'INR', keyId: 'test_key' });
});

paymentRoutes.post('/payment/verify', (req, res) => {
  res.json({ message: 'Payment verified successfully', status: 'success' });
});

app.use('/api/payment', paymentRoutes);

// Notification routes
const notificationRoutes = express.Router();

notificationRoutes.post('/sms/send', (req, res) => {
  console.log('SMS sent:', req.body.to, req.body.message);
  res.json({ message: 'SMS sent successfully' });
});

notificationRoutes.post('/whatsapp/send', (req, res) => {
  console.log('WhatsApp sent:', req.body.to, req.body.message);
  res.json({ message: 'WhatsApp message sent' });
});

app.use('/api/notification', notificationRoutes);

// AI routes
const aiRoutes = express.Router();

aiRoutes.post('/call/initiate', (req, res) => {
  console.log('AI voice call initiated for booking:', req.body.bookingId);
  res.json({ message: 'AI call initiated', callId: 'call_' + Date.now() });
});

aiRoutes.post('/chatbot', (req, res) => {
  const { message } = req.body;
  const responses = {
    book: 'To book a ticket, please provide source, destination, and date.',
    cancel: 'To cancel a booking, please provide your booking ID.',
    track: 'Please provide your booking ID to track your bus.',
    refund: 'Refunds are processed within 5-7 business days.',
    default: 'I can help you with bookings, cancellations, tracking, and refunds. What do you need?'
  };
  
  let response = responses.default;
  for (const key in responses) {
    if (message.toLowerCase().includes(key)) {
      response = responses[key];
      break;
    }
  }
  
  res.json({ response });
});

app.use('/api/ai', aiRoutes);

// GPS tracking routes
const gpsRoutes = express.Router();

gpsRoutes.get('/location/:tripId', (req, res) => {
  res.json({
    location: {
      latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
      speed: Math.floor(Math.random() * 60)
    },
    ETA: {
      estimatedArrival: new Date(Date.now() + Math.random() * 3600 * 1000),
      delayMinutes: 0
    }
  });
});

app.use('/api/gps', gpsRoutes);

// Analytics routes
const analyticsRoutes = express.Router();

analyticsRoutes.get('/analytics/revenue', (req, res) => {
  res.json({
    totalRevenue: 150000,
    totalBookings: 250,
    avgBookingValue: 600,
    cancellations: 12
  });
});

analyticsRoutes.get('/analytics/bookings', (req, res) => {
  res.json({
    statusCounts: { confirmed: 238, cancelled: 12 },
    paymentCounts: { success: 250, pending: 0, failed: 0 }
  });
});

app.use('/api/analytics', analyticsRoutes);

// Operator routes
const operatorRoutes = express.Router();

operatorRoutes.get('/buses', (req, res) => {
  res.json(operatorData.buses);
});

operatorRoutes.post('/buses', (req, res) => {
  const bus = { _id: 'bus' + (operatorData.buses.length + 1), ...req.body, isActive: true };
  operatorData.buses.push(bus);
  res.status(201).json(bus);
});

operatorRoutes.put('/buses/:id', (req, res) => {
  const index = operatorData.buses.findIndex(b => b._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Bus not found' });
  operatorData.buses[index] = { ...operatorData.buses[index], ...req.body };
  res.json(operatorData.buses[index]);
});

operatorRoutes.delete('/buses/:id', (req, res) => {
  const index = operatorData.buses.findIndex(b => b._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Bus not found' });
  operatorData.buses.splice(index, 1);
  res.json({ message: 'Bus deleted' });
});

operatorRoutes.get('/routes', (req, res) => {
  res.json(operatorData.routes);
});

operatorRoutes.post('/routes', (req, res) => {
  const route = { _id: 'route' + (operatorData.routes.length + 1), ...req.body };
  operatorData.routes.push(route);
  res.status(201).json(route);
});

operatorRoutes.put('/routes/:id', (req, res) => {
  const index = operatorData.routes.findIndex(r => r._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Route not found' });
  operatorData.routes[index] = { ...operatorData.routes[index], ...req.body };
  res.json(operatorData.routes[index]);
});

operatorRoutes.delete('/routes/:id', (req, res) => {
  const index = operatorData.routes.findIndex(r => r._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Route not found' });
  operatorData.routes.splice(index, 1);
  res.json({ message: 'Route deleted' });
});

operatorRoutes.get('/trips', (req, res) => {
  const tripsWithDetails = operatorData.trips.map(trip => {
    const bus = operatorData.buses.find(b => b._id === trip.busId);
    const route = operatorData.routes.find(r => r._id === trip.routeId);
    return {
      ...trip,
      bus,
      route
    };
  });
  res.json(tripsWithDetails);
});

operatorRoutes.post('/trips', (req, res) => {
  try {
    const { busId, routeId, departureTime, arrivalTime, price, availableSeats, days, tripStatus } = req.body;

    if (!busId || !routeId || !departureTime || !arrivalTime || !price || availableSeats === undefined) {
      return res.status(400).json({ message: 'Missing required fields: busId, routeId, departureTime, arrivalTime, price, availableSeats' });
    }

    const bus = operatorData.buses.find(b => b._id === busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    const route = operatorData.routes.find(r => r._id === routeId);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
      return res.status(400).json({ message: 'Invalid departure or arrival time' });
    }
    if (departure >= arrival) {
      return res.status(400).json({ message: 'Departure time must be before arrival time' });
    }
    if (availableSeats > bus.capacity) {
      return res.status(400).json({ message: `Available seats cannot exceed bus capacity (${bus.capacity})` });
    }

    const trip = {
      _id: 'trip' + (operatorData.trips.length + 1),
      busId,
      routeId,
      departureTime: departure.toISOString(),
      arrivalTime: arrival.toISOString(),
      price: Number(price),
      availableSeats: Number(availableSeats),
      days: Array.isArray(days) ? days : [],
      tripStatus: tripStatus || 'scheduled',
      seatLayout: bus.seatLayout
    };

    operatorData.trips.push(trip);
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

operatorRoutes.put('/trips/:id', (req, res) => {
  const index = operatorData.trips.findIndex(t => t._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Trip not found' });
  operatorData.trips[index] = { ...operatorData.trips[index], ...req.body };
  res.json(operatorData.trips[index]);
});

operatorRoutes.delete('/trips/:id', (req, res) => {
  const index = operatorData.trips.findIndex(t => t._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Trip not found' });
  operatorData.trips.splice(index, 1);
  res.json({ message: 'Trip deleted' });
});

operatorRoutes.get('/dashboard', (req, res) => {
  const totalBuses = operatorData.buses.length;
  const totalRoutes = operatorData.routes.length;
  const totalTrips = operatorData.trips.length;
  const totalBookings = mockData.bookings.length;
  
  res.json({
    totalBuses,
    totalRoutes,
    totalTrips,
    totalBookings,
    recentTrips: operatorData.trips.slice(-5)
  });
});

app.use('/api/operator', operatorRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 3006;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Smart Travel Bus Booking Server running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /health - Health check');
    console.log('  POST /api/auth/register - User registration');
    console.log('  POST /api/auth/login - User login');
    console.log('  POST /api/auth/verify-otp - OTP verification');
    console.log('  GET  /api/booking/buses?source=&destination=&date= - Search buses');
    console.log('  POST /api/booking/booking - Create booking');
    console.log('  GET  /api/booking/ticket/:id - Get ticket');
    console.log('  POST /api/payment/payment/initiate - Initialize payment');
    console.log('  POST /api/payment/payment/verify - Verify payment');
    console.log('  POST /api/ai/call/initiate - Initiate AI voice call');
    console.log('  POST /api/ai/chatbot - Chatbot query');
    console.log('  GET  /api/gps/location/:tripId - Get bus location');
  console.log('  GET  /api/analytics/analytics/revenue - Revenue analytics');
  console.log('  GET  /api/operator/dashboard - Operator dashboard');
  console.log('  GET  /api/operator/buses - List buses');
  console.log('  POST /api/operator/buses - Create bus');
  console.log('  PUT  /api/operator/buses/:id - Update bus');
  console.log('  DELETE /api/operator/buses/:id - Delete bus');
  console.log('  GET  /api/operator/routes - List routes');
  console.log('  POST /api/operator/routes - Create route');
  console.log('  GET  /api/operator/trips - List trips');
  console.log('  POST /api/operator/trips - Create trip');
  console.log('  GET  /operator - Operator dashboard UI');
});
}

module.exports = app;