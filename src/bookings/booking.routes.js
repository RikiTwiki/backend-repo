const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const checkAdmin = require('../auth/middleware'); 
const authMiddleware = require('../auth/auth'); 


router.post('/add-booking', authMiddleware, bookingController.createBooking);


router.get('/bookings', authMiddleware, bookingController.getBookings);

module.exports = router;