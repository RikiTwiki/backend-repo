const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const checkAdmin = require('../auth/middleware');

const User = require('../users/user.entity');

// Роуты для управления пользователями
router.get('/users', checkAdmin, userController.getUsers);
// router.post('/users', checkAdmin, userController.createUser);
// router.put('/users/:id', checkAdmin, userController.updateUser);
// router.delete('/users/:id', checkAdmin, userController.deleteUser);

module.exports = router;