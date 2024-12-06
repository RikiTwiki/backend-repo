const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../auth/auth');

console.log(userController.getUsers); 

router.get('/users', authMiddleware, userController.getUsers);
router.post('/users', authMiddleware, userController.createUser);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

module.exports = router;