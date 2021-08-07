import {config} from './config';
import mongoose from 'mongoose';

const connectionString = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`;

mongoose.connect(
    connectionString,
    {
      user: config.DB_USER,
      pass: config.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
);

const db = mongoose.connection;

db.on('connecting', () => console.log('Connecting to MongoDB...'));
db.on('connected', () => console.log('Connected to MongoDB.'));
db.on('error', () => console.error.bind(console, 'MongoDB connection error:'));

export {db};
