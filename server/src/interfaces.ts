import {Document, PopulatedDoc} from 'mongoose';

/**
 * Extend user object
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      name: string;
      avatar?: string;
    }
  }
}

/**
 * Interface for an image
 */
export interface Image extends Document {
  filename: string; // File name after processing (ending with jpg)
  originalFilename: string; // File name before processing (any image type)
}

/**
 * Interface for an album
 */
export interface Album extends Document {
  name: string;
  slug: string;
  date: Date;
  authors: string[];
  description?: string;
  images: PopulatedDoc<Image & Document>[];
  thumbnail?: PopulatedDoc<Image & Document>;
}
