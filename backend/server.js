// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const materialRoutes = require('./routes/materials');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const announcementRoutes = require('./routes/announcements');
const userRoutes = require('./routes/users');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route mounting
app.use('/api/users', authRoutes); // Possibly remove one of these to avoid duplicates
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/announcements', announcementRoutes);
app.use(errorHandler);

// Export app for Jest, run server only if not in test
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // ✅
