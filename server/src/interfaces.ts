import {Document} from 'mongoose';
import {Request as ExpressRequest} from 'express';

/**
 * Extension to Express' request type to allow attaching user session
 */
export interface Request extends ExpressRequest {
  user?: UserSession,
}

/**
 * User session interface
 */
export interface UserSession {
  role: 'user' | 'admin',
}

/**
 * User interface
 */
export interface User {
  username: string,
  password: string,
  role: 'user' | 'admin',
}

/**
 * User document interface
 */
export interface UserDocument extends User, Document {
  comparePassword(password: string): Promise<boolean>,
}

/**
 * Album interface
 */
export interface Album {
  name: string,
  slug: string,
  date: Date,
  authors?: string[],
  description?: string,
  images?: string[],
  thumbnail?: string
}

/**
 * Album document interface
 */
export interface AlbumDocument extends Album, Document {}
