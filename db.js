import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const dbUri = process.env.DBURI.replace('<PASSWORD>', process.env.DB_PASSWORD);

const dbOptions = {
  autoIndex: false,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const dbConnectionEvents = () => {
  mongoose.connection.on('connecting', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Connecting to DB ...');
    }
  });
  mongoose.connection.on('connected', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Connected to MongoDB Atlas Cloud Database');
    }
  });
  mongoose.connection.on('reconnected', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Connection Reestablished');
    }
  });
  mongoose.connection.on('disconnected', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Connection Disconnected');
    }
  });
  mongoose.connection.on('close', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Connection Closed');
    }
  });
  mongoose.connection.on('error', (err) => {
    console.error(`Connection error: ${err.stack}`);
  });
};

const dbConnect = async () => {
  try {
    await mongoose.connect(dbUri, dbOptions);
  } catch (err) {
    console.error(`Connection error: ${err.stack}`);
  }
};

export { dbConnectionEvents, dbConnect };
