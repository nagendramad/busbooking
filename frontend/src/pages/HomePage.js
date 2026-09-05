import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBuses } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchBuses(searchParams);
      setBuses(results);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="home-page">
      <header>
        <h1>Smart Travel Bus Booking</h1>
      </header>
      
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Source</label>
            <input
              type="text"
              value={searchParams.source}
              onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Buses'}
          </button>
        </form>
      </section>
      
      <section className="results-section">
        {buses.map((bus) => (
          <div key={bus._id} className="bus-card">
            <h3>{bus.busId?.busName}</h3>
            <p>Type: {bus.busId?.busType}</p>
            <p>Departure: {new Date(bus.departureTime).toLocaleString()}</p>
            <p>Price: ₹{bus.price}</p>
            <p>Available Seats: {bus.availableSeats}</p>
            <button onClick={() => navigate(`/seats/${bus._id}`)}>Select Seats</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;