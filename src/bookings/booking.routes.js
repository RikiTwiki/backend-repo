const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const checkAdmin = require('../auth/middleware'); // Middleware для проверки роли администратора
const authMiddleware = require('../auth/auth'); // Аутентификация для всех пользователей

// Создание нового бронирования
router.post('/add-booking', authMiddleware, bookingController.createBooking);

// Получение бронирований (для админов — все, для обычных пользователей — только свои)
router.get('/bookings', authMiddleware, bookingController.getBookings);

module.exports = router;