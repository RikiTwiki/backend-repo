const express = require('express');
const router = express.Router();
const roomController = require('./room.controller');
const authMiddleware = require('../auth/auth');

const checkAdmin = require('../auth/middleware');

const booking = require('../bookings/booking.controller')

// Эндпоинт для получения всех комнат
// router.get('/', authMiddleware, roomController.getAllRooms);

// Эндпоинт для получения забронированных комнат
router.get('/booked-rooms', authMiddleware, booking.getBookings);

console.log('Room Controller:', roomController);

// Эндпоинт для создания новой комнаты
router.post('/add-rooms', checkAdmin, roomController.addRoom);

// Эндпоинт для получения всех комнат
router.get('/rooms', roomController.getAllRooms);

// Эндпоинт для бронирования комнаты
router.post('/book', authMiddleware, roomController.bookRoom);

// Эндпоинт для получения списка брони
router.get('/bookings', authMiddleware, booking.getBookings);

// router.post('/check-availability', roomController.checkRoomAvailability);

module.exports = router;