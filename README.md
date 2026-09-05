# Smart Travel Bus Booking & Management System

## Overview
AI-Based Smart Travel Bus Booking & Management System with real-time seat selection, secure payments, WhatsApp/SMS notifications, and AI voice reminders.

## Architecture
Microservices architecture with the following services:
- **Auth Service** (port 3001) - User registration, login, OTP verification
- **Booking Service** (port 3002) - Bus search, seat selection, ticket booking
- **Payment Service** (port 3003) - Razorpay integration, payment processing
- **Notification Service** (port 3004) - SMS, WhatsApp, Email notifications
- **AI Service** (port 3005) - Voice calling, chatbot, boarding assistance
- **GPS Tracking Service** (port 3006) - Real-time location tracking
- **Analytics Service** (port 3007) - Revenue, bookings, utilization reports

## Installation

```bash
# Clone repository
git clone <repository-url>
cd bus-boking

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start services
npm run dev
```

## Docker Deployment

```bash
docker-compose up -d
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Forgot password

### Booking
- `GET /api/booking/buses` - Search buses
- `POST /api/booking/booking` - Create booking
- `GET /api/booking/ticket/:id` - Get ticket
- `POST /api/booking/cancel` - Cancel booking

### Payment
- `POST /api/payment/initiate` - Initialize payment
- `POST /api/payment/verify` - Verify payment

### Notification
- `POST /api/notification/sms/send` - Send SMS
- `POST /api/notification/whatsapp/send` - Send WhatsApp
- `POST /api/notification/send-confirmation` - Send ticket confirmation

### AI
- `POST /api/ai/call/initiate` - Initiate AI voice call
- `POST /api/ai/chatbot` - Chatbot query

### GPS Tracking
- `POST /api/gps/location/update` - Update bus location
- `GET /api/gps/location/:tripId` - Get bus location

### Analytics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/bookings` - Booking analytics
- `GET /api/analytics/bus-utilization` - Bus utilization