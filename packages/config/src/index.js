module.exports = {
  auth: {
    port: process.env.AUTH_SERVICE_PORT || 3001,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
  },
  booking: {
    port: process.env.BOOKING_SERVICE_PORT || 3002
  },
  payment: {
    port: process.env.PAYMENT_SERVICE_PORT || 3003,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET
  },
  notification: {
    port: process.env.NOTIFICATION_SERVICE_PORT || 3004,
    twilioSid: process.env.TWILIO_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN
  },
  aiTracking: {
    port: process.env.AI_SERVICE_PORT || 3005
  },
  gps: {
    port: process.env.GPS_SERVICE_PORT || 3006
  },
  analytics: {
    port: process.env.ANALYTICS_SERVICE_PORT || 3007
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-booking'
  }
};