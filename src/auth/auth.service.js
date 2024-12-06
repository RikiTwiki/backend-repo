const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');  

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; 

async function login(email, password) {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user };
}

async function register(email, password) {
  
  if (!email || !password) {
    throw new Error('Email and password are required and cannot be empty');
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  console.log("Registering user with email: " + email);

  try {
    
    const newUser = new User(email, password); 
    const savedUser = await newUser.save(); 

    
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: savedUser };
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;  
  }
}

module.exports = {
  login,
  register
};