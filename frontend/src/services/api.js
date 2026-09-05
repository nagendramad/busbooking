import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Bus, Trip, Route } from '../../../shared/models';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const searchBuses = async (params) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/booking/buses?${queryParams}`);
  return response.json();
};

export const getBusDetails = async (busId) => {
  const response = await fetch(`${API_BASE}/booking/buses/${busId}`);
  return response.json();
};

export const bookTicket = async (bookingData) => {
  const response = await fetch(`${API_BASE}/booking/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  return response.json();
};

export const getBooking = async (bookingId) => {
  const response = await fetch(`${API_BASE}/booking/ticket/${bookingId}`);
  return response.json();
};

export const cancelBooking = async (bookingId) => {
  const response = await fetch(`${API_BASE}/booking/booking/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId })
  });
  return response.json();
};

export const getBookingHistory = async (userId) => {
  const response = await fetch(`${API_BASE}/booking/bookings/user/${userId}`);
  return response.json();
};

export const initPayment = async (paymentData) => {
  const response = await fetch(`${API_BASE}/payment/payment/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};

export const verifyPayment = async (paymentData) => {
  const response = await fetch(`${API_BASE}/payment/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};