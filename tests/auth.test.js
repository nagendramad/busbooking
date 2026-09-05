const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('../services/auth/src/index');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Service', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-booking-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /auth/register - should register user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Registration successful. Please verify OTP.');
  });

  test('POST /auth/login - should login user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        phone: '1234567890',
        password: 'password123'
      });
    
    expect([200, 403]).toContain(res.statusCode);
  });
});