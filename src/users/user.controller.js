const express = require('express');
const router = express.Router();
const User = require('./user.model');  
const authService = require('../auth/auth.service'); 
const db = require('../config/db');
const bcrypt = require('bcrypt'); // Убедитесь, что bcrypt импортирован, если используется

// Маршрут логина
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

// Маршрут регистрации
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
const getUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создание нового пользователя
const createUser = async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      'INSERT INTO users (email, password, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, role',
      [email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Обновление данных пользователя
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET email = $1, role = $2 WHERE id = $3 RETURNING id, email, role',
      [email, role, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Объединенный экспорт
module.exports = {
  router,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};