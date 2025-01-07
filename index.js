const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./database/database');
const cors = require('cors');
const fileupload = require('express-fileupload');
const path = require('path');
const crypto = require('node:crypto');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/review', require('./routes/reviewRoutes'));
app.use('/api/book', require('./routes/bookRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Start server if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  // Connect to MongoDB and then start the server
  connectDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
}

module.exports = app;
