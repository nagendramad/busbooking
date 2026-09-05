import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBooking } from '../services/api';

const TicketPage = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetchTicket();
  }, [bookingId]);

  const fetchTicket = async () => {
    try {
      // Mock ticket data
      const mockTicket = {
        bookingId,
        tripId: {
          busId: { busName: 'Express Travels' },
          routeId: { source: 'Bangalore', destination: 'Mumbai' },
          departureTime: new Date(Date.now() + 86400000),
          arrivalTime: new Date(Date.now() + 86400000 + 43200000)
        },
        passengers: [{ name: 'John Doe', age: 25, gender: 'male' }],
        finalAmount: 500,
        qrCode: 'data:image/png;base64,mock_qr_code',
        seats: [{ seatNumber: 'L1' }]
      };
      setTicket(mockTicket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  if (!ticket) return <div>Loading ticket...</div>;

  return (
    <div className="ticket-page">
      <div className="ticket">
        <h2>E-Ticket</h2>
        <div className="ticket-header">
          <h3>{ticket.tripId.busId.busName}</h3>
          <p>Booking ID: {ticket.bookingId}</p>
        </div>
        
        <div className="ticket-details">
          <div className="route-info">
            <p><strong>From:</strong> {ticket.tripId.routeId.source}</p>
            <p><strong>To:</strong> {ticket.tripId.routeId.destination}</p>
          </div>
          
          <div className="time-info">
            <p><strong>Departure:</strong> {new Date(ticket.tripId.departureTime).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(ticket.tripId.arrivalTime).toLocaleString()}</p>
          </div>
          
          <div className="passenger-info">
            <h4>Passenger Details</h4>
            {ticket.passengers.map((p, index) => (
              <p key={index}>{p.name} (Age: {p.age}, Seat: {ticket.seats[index]?.seatNumber})</p>
            ))}
          </div>
          
          <div className="qr-section">
            <img src={ticket.qrCode} alt="QR Code" />
            <p>Amount Paid: ₹{ticket.finalAmount}</p>
          </div>
        </div>
        
        <button onClick={() => window.print()}>Print Ticket</button>
        <button onClick={() => window.alert('Ticket shared')}>Share Ticket</button>
      </div>
    </div>
  );
};

export default TicketPage;