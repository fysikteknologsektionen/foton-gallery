/* eslint-disable no-unused-vars */
import {Document} from 'mongoose';

// Extend the Request interface for express to allow attaching a user object
declare global {
  namespace Express {
    interface Request {
      user?: UserSession
    }
  }
}

/**
 * User session interface
 */
export interface UserSession {
  id: string,
  isAdmin: boolean,
}

/**
 * User interface
 */
export interface User extends Record<string, any> {
  email: string,
  password: string,
  isAdmin: boolean,
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
export interface Album extends Record<string, any> {
  name: string,
  slug: string,
  description?: string,
  images?: string[],
  authors?: string[],
  date: Date,
  thumbnail?: string
}

/**
 * Album document interface
 */
export interface AlbumDocument extends Album, Document {};
