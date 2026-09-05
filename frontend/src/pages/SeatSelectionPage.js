import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusDetails, bookTicket } from '../services/api';

const SeatSelectionPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBusDetails();
  }, [tripId]);

  const fetchBusDetails = async () => {
    try {
      // Would fetch trip details with bus info
      const mockBus = {
        _id: tripId,
        busName: 'Express Travels',
        busType: 'sleeper',
        capacity: 40,
        seatLayout: {
          lower: Array.from({ length: 20 }, (_, i) => ({
            seatNumber: `L${i + 1}`,
            isAvailable: Math.random() > 0.3
          })),
          upper: Array.from({ length: 20 }, (_, i) => ({
            seatNumber: `U${i + 1}`,
            isAvailable: Math.random() > 0.3
          }))
        }
      };
      setBus(mockBus);
    } catch (error) {
      console.error('Error fetching bus:', error);
    }
  };

  const toggleSeat = (seat) => {
    if (!seat.isAvailable) return;
    
    const isSelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seat.seatNumber));
      setPassengers(passengers.filter(p => p.seatNumber !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setPassengers([...passengers, {
        seatNumber: seat.seatNumber,
        name: '',
        age: '',
        gender: 'male'
      }]);
    }
  };

  const updatePassenger = (seatNumber, field, value) => {
    setPassengers(passengers.map(p => 
      p.seatNumber === seatNumber ? { ...p, [field]: value } : p
    ));
  };

  const handleProceed = async () => {
    setLoading(true);
    try {
      const bookingData = {
        userId: 'user123',
        tripId,
        seats: selectedSeats.map(s => ({ seatNumber: s.seatNumber, gender: passengers.find(p => p.seatNumber === s.seatNumber)?.gender })),
        passengers,
        totalAmount: selectedSeats.length * 500,
        discount: 0
      };
      
      const result = await bookTicket(bookingData);
      navigate(`/payment/${result.bookingId}`);
    } catch (error) {
      console.error('Booking error:', error);
    }
    setLoading(false);
  };

  if (!bus) return <div>Loading...</div>;

  return (
    <div className="seat-selection-page">
      <h2>{bus.busName} - {bus.busType}</h2>
      
      <div className="seat-layout">
        <h3>Lower Deck</h3>
        <div className="seats-grid">
          {bus.seatLayout.lower.map((seat, index) => (
            <button
              key={seat.seatNumber}
              className={`seat ${seat.isAvailable ? '' : 'unavailable'} ${selectedSeats.find(s => s.seatNumber === seat.seatNumber) ? 'selected' : ''}`}
              onClick={() => toggleSeat(seat)}
              disabled={!seat.isAvailable}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
        
        <h3>Upper Deck</h3>
        <div className="seats-grid">
          {bus.seatLayout.upper.map((seat, index) => (
            <button
              key={seat.seatNumber}
              className={`seat ${seat.isAvailable ? '' : 'unavailable'} ${selectedSeats.find(s => s.seatNumber === seat.seatNumber) ? 'selected' : ''}`}
              onClick={() => toggleSeat(seat)}
              disabled={!seat.isAvailable}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>
      
      {selectedSeats.length > 0 && (
        <div className="passenger-form">
          <h3>Passenger Details</h3>
          {passengers.map((passenger) => (
            <div key={passenger.seatNumber} className="passenger-card">
              <h4>Seat: {passenger.seatNumber}</h4>
              <input
                type="text"
                placeholder="Name"
                value={passenger.name}
                onChange={(e) => updatePassenger(passenger.seatNumber, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Age"
                value={passenger.age}
                onChange={(e) => updatePassenger(passenger.seatNumber, 'age', e.target.value)}
              />
              <select
                value={passenger.gender}
                onChange={(e) => updatePassenger(passenger.seatNumber, 'gender', e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          ))}
          
          <button onClick={handleProceed} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;