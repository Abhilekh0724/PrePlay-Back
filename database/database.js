const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URL:', process.env.MONGODB_URL);
    
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");

    // Listen for connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

module.exports = connectDb;
