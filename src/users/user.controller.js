// src/auth/auth.controller.js
const express = require('express');
const router = express.Router();
const User = require('../users/user.model');  // Импорт модели пользователя
const authService = require('./auth.service'); // Убедитесь, что authService содержит методы для работы с токенами

const db = require('../config/db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Unauthorized');
    }
    const token = await authService.generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User(email, password);
    const newUser = await user.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Получение списка пользователей (только для админов)
exports.getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Создание нового пользователя
exports.createUser = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Хэшируем пароль
        const result = await db.query(
            'INSERT INTO users (email, password, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, role',
            [email, hashedPassword, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Обновление данных пользователя
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ message: 'Email and role are required' });
    }

    try {
        const result = await db.query(
            'UPDATE users SET email = $1, role = $2 WHERE id = $3 RETURNING id, email, role',
            [email, role, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = router;