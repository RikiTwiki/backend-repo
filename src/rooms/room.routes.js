const express = require('express');
const router = express.Router();
const roomController = require('./room.controller');
const authMiddleware = require('../auth/auth');

const checkAdmin = require('../auth/middleware');

const booking = require('../bookings/booking.controller')

// router.get('/', authMiddleware, roomController.getAllRooms);

router.get('/booked-rooms', authMiddleware, booking.getBookings);

console.log('Room Controller:', roomController);

router.post('/add-rooms', checkAdmin, roomController.addRoom);

router.get('/rooms', roomController.getAllRooms);

router.post('/book', authMiddleware, roomController.bookRoom);

router.get('/bookings', authMiddleware, booking.getBookings);

// router.post('/check-availability', roomController.checkRoomAvailability);

module.exports = router;