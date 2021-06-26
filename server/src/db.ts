import mongoose from 'mongoose';
import {config} from './env';

const connectionString = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`;

mongoose.connect(connectionString, {
  user: config.DB_USER,
  pass: config.DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

export const db = mongoose.connection;

db.on('connecting', () => console.log('Connecting to MongoDB...'));
db.on('connected', () => console.log('Connected to MongoDB.'));
db.on('error', () => console.error.bind(console, 'MongoDB connection error:'));
