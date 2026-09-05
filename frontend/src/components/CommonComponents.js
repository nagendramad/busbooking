// Search component for bus search
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchComponent = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="search-component">
      <input
        type="text"
        placeholder="From"
        value={searchParams.source}
        onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="To"
        value={searchParams.destination}
        onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
        required
      />
      <input
        type="date"
        value={searchParams.date}
        onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
        required
      />
      <button type="submit">Search</button>
    </form>
  );
};

// Seat map component
export const SeatMap = ({ bus, selectedSeats, onSeatSelect }) => {
  const renderSeat = (seat, deck) => {
    const isSelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);
    
    return (
      <button
        key={`${deck}_${seat.seatNumber}`}
        className={`seat ${seat.isAvailable ? '' : 'booked'} ${isSelected ? 'selected' : ''}`}
        onClick={() => seat.isAvailable && onSeatSelect(seat)}
        disabled={!seat.isAvailable}
      >
        {seat.seatNumber}
      </button>
    );
  };

  return (
    <div className="seat-map">
      <div className="deck">
        <h4>Lower Deck</h4>
        <div className="seats">
          {bus.seatLayout?.lower?.map(s => renderSeat(s, 'lower'))}
        </div>
      </div>
      <div className="deck">
        <h4>Upper Deck</h4>
        <div className="seats">
          {bus.seatLayout?.upper?.map(s => renderSeat(s, 'upper'))}
        </div>
      </div>
    </div>
  );
};

// Ticket component for displaying e-ticket
export const TicketComponent = ({ booking }) => {
  return (
    <div className="ticket-component">
      <div className="ticket-header">
        <h3>{booking.tripId?.busId?.busName}</h3>
        <span>{booking.bookingStatus}</span>
      </div>
      
      <div className="ticket-body">
        <div className="route">
          <span>{booking.tripId?.routeId?.source}</span>
          <span>→</span>
          <span>{booking.tripId?.routeId?.destination}</span>
        </div>
        
        <div className="times">
          <p>Departure: {new Date(booking.tripId?.departureTime).toLocaleTimeString()}</p>
          <p>Arrival: {new Date(booking.tripId?.arrivalTime).toLocaleTimeString()}</p>
        </div>
        
        <div className="passengers">
          {booking.passengers?.map((p, i) => (
            <p key={i}>{p.name} - {booking.seats?.[i]?.seatNumber}</p>
          ))}
        </div>
      </div>
      
      <img src={booking.qrCode} alt="QR Code" className="qr-code" />
    </div>
  );
};