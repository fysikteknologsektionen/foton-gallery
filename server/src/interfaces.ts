import {Document} from 'mongoose';
import {Request} from 'express';

/**
 * Extension of Express' Request interface to allow attaching a session object
 */
export interface RequestWithUser extends Request {
  user?: UserSession;
}

/**
 * Session type encoded in authentication tokens
 */
export interface UserSession {
  role: 'user' | 'admin';
}

/**
 * Interface for a user's data
 */
export interface UserAuthenicationData {
  username: string;
  password: string;
}

/**
 * Interface for representing a user document
 */
export interface User extends UserSession, UserAuthenicationData, Document {
  comparePassword(password: string): Promise<boolean>;
}

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
