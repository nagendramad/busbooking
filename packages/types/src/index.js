// User Types
export const UserType = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  OPERATOR: 'operator',
  DRIVER: 'driver',
  SUPPORT_AGENT: 'support_agent'
};

// Bus Types
export const BusType = {
  SLEEPER: 'sleeper',
  SEATER: 'seater',
  SEMI_SLEEPER: 'semi_sleeper'
};

// Bus Amenities
export const Amenities = {
  AC: 'ac',
  WIFI: 'wifi',
  CHARGING: 'charging',
  WATER: 'water',
  BLANKET: 'blanket'
};

// Seat Types
export const SeatType = {
  LOWER: 'lower',
  UPPER: 'upper',
  SIDE_LOWER: 'side_lower',
  SIDE_UPPER: 'side_upper'
};

// Gender
export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

// Payment Status
export const PaymentStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Booking Status
export const BookingStatus = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Trip Status
export const TripStatus = {
  SCHEDULED: 'scheduled',
  STARTED: 'started',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled'
};

// Notification Types
export const NotificationType = {
  WHATSAPP: 'whatsapp',
  SMS: 'sms',
  EMAIL: 'email'
};