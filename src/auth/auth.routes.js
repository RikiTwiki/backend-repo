const express = require('express');
const router = express.Router();
const authService = require('./auth.service');

const checkAdmin = require('./middleware');

router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body); 
    const { email, password } = req.body;
    try {
        const { token, user } = await authService.login(email, password);
        res.json({ token, user });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try { 
    const { token, user } = await authService.register(email, password);
    res.status(201).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/admin', checkAdmin, async (req, res) => {
    try {
        res.status(200).json({ isAdmin: true });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;