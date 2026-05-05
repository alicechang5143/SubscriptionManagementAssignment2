const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) return DatabaseConnection.instance;
    this.connected = false;
    DatabaseConnection.instance = this;
  }

  async connect(uri = process.env.MONGO_URI) {
    if (this.connected) return mongoose.connection;
    if (!uri) throw new Error('MONGO_URI is missing');

    await mongoose.connect(uri);
    this.connected = true;
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  }
}

module.exports = new DatabaseConnection();
