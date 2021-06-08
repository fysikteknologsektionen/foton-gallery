import mongoose, { Connection } from 'mongoose';
import { config } from './env';

const connectionString: string = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`;

mongoose.connect(connectionString, {
  user: config.DB_USER,
  pass: config.DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

export const db: Connection = mongoose.connection;

db.on('connecting', _ => console.log('Connecting to MongoDB...'));
db.on('connected', _ => console.log('Connected to MongoDB.'));
db.on('error', _ => console.error.bind(console, 'MongoDB connection error:'));