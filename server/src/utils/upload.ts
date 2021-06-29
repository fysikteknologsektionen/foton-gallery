import cryptoRandomString from 'crypto-random-string';
import {Request} from 'express';
import multer, {FileFilterCallback} from 'multer';
import path from 'path';
import {config} from '../env';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'images'));
  },
  filename: (req, file, cb) => {
    // Generate a "unique" file name
    cb(null, cryptoRandomString({length: 32}) + path.extname(file.originalname));
  },
});

/**
 * Filters file types to only allow image types
 * @param req Express request object
 * @param file Files to filter
 * @param cb Callback
 */
function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  // Check if the mimetype is any image/*-type
  if (file.mimetype.match(/^image\//)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: Number(config.APP_MAX_FILE_SIZE) * 1024 * 1024,
  },
});
