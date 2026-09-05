import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AnalyticsDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/seats/:tripId" element={<SeatSelectionPage />} />
            <Route path="/booking/:tripId" element={<BookingPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/ticket/:bookingId" element={<TicketPage />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;