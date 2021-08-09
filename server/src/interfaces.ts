import {PopulatedDoc, Types} from 'mongoose';

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
export interface Image {
  filename: string; // File name after processing (ending with jpg)
  originalFilename: string; // File name before processing (any image type)
}

/**
 * Interface for an album
 */
export interface Album {
  name: string;
  slug: string;
  date: Date;
  authors: string[];
  description?: string;
  images: PopulatedDoc<Image, Types.ObjectId>[];
  thumbnail?: PopulatedDoc<Image, Types.ObjectId>;
}
