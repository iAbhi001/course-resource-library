const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/mailer');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) 
      return res.status(400).json({ msg: 'Email in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn:'1h' });
    res.json({ token, role: user.role });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('[DEBUG] Email:', email);
    console.log('[DEBUG] Password Input:', password);

    const user = await User.findOne({ email });
    console.log('[DEBUG] Found User:', user);

    if (!user) {
      console.log('[DEBUG] No user found for email');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('[DEBUG] Stored Hash:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[DEBUG] Password Match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });

  } catch (err) {
    console.error('[DEBUG] Login Error:', err);
    next(err);
  }
};


exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'No user with that email' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600000; //1h
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Token: ${token}`
    });
    res.json({ msg: 'Reset email sent' });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ 
      resetToken: token,
      resetExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = user.resetExpires = undefined;
    await user.save();
    res.json({ msg: 'Password has been reset' });
  } catch (err) { next(err); }
};
