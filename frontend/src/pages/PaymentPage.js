import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/api';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const handlePayment = async () => {
    setProcessing(true);
    
    // Mock payment verification
    const paymentData = {
      orderId: 'order_' + Date.now(),
      paymentId: 'payment_' + Date.now(),
      signature: 'mock_signature'
    };
    
    try {
      await verifyPayment(paymentData);
      navigate(`/ticket/${bookingId}`);
    } catch (error) {
      console.error('Payment error:', error);
    }
    
    setProcessing(false);
  };

  return (
    <div className="payment-page">
      <h2>Payment for Booking: {bookingId}</h2>
      
      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        <div className="method-options">
          <label>
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI Payment
          </label>
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit/Debit Card
          </label>
          <label>
            <input
              type="radio"
              value="wallet"
              checked={paymentMethod === 'wallet'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Wallet
          </label>
        </div>
        
        {paymentMethod === 'card' && (
          <div className="card-form">
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            />
            <input
              type="text"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            />
          </div>
        )}
        
        {paymentMethod === 'upi' && (
          <div className="upi-form">
            <p>Scan QR code or enter UPI ID</p>
            <div className="qr-placeholder">QR Code</div>
          </div>
        )}
        
        <button onClick={handlePayment} disabled={processing}>
          {processing ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;