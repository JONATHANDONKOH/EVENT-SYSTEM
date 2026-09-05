const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, comparePassword } = require('../Models/Users');

function sendTokenCookie(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
}
// @route  POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // createUser hashes the password internally via bcrypt
    const user = await createUser({ name, email, password, location });

    sendTokenCookie(res, user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route  POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // findUserByEmail returns the full row, including the hashed password
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenCookie(res, user.id);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route  POST /api/auth/logout
function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { register, login, logout };