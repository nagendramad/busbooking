import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login
    setTimeout(() => {
      localStorage.setItem('token', 'mock_token');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Phone Number"
          value={credentials.phone}
          onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default LoginPage;