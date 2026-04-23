const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set. Set it in environment variables.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4 to resolve Node 17+ local DNS issues with mongodb+srv
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      console.error('\n🛠️  Local Development Tip:');
      console.error('If you are connecting from localhost to MongoDB Atlas (mongodb+srv://...),');
      console.error('ensure your current IP address is whitelisted in the MongoDB Atlas "Network Access" settings.');
      console.error('Alternatively, fallback to a local instance like mongodb://127.0.0.1:27017/tecmart in .env\n');
    }
    process.exit(1);
  }
};

module.exports = connectDB;