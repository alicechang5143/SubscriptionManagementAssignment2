const databaseConnection = require('./DatabaseConnection');

const connectDB = async () => {
  try {
    await databaseConnection.connect();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
