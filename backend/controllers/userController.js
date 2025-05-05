// backend/controllers/userController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    // If user requests teacher role, verify the secret key:
    if (role === 'teacher') {
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        return res
          .status(403)
          .json({ msg: 'Invalid admin key for teacher sign‑up.' });
      }
    }

    // (rest is your existing signup logic)
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role });
    // sign JWT, etc...
    const token = jwt.sign({ id: user._id, role: user.role },
                           process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role }});
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' }, '-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};
