import {Document} from 'mongoose';

/**
 * Interface for an album's meta information
 */
export interface AlbumMetaData {
  name: string;
  date: Date;
  authors: string[];
  description?: string;
}

/**
 * Interface for an albums image information
 */
export interface AlbumImageData {
  images: string[];
  thumbnail?: string;
}

/**
 * Interface for representing an album document
 */
export interface Album extends AlbumMetaData, AlbumImageData, Document {
  slug: string;
}
