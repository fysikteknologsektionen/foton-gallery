/* eslint-disable no-unused-vars */
import {Document} from 'mongoose';

/**
 * User session interface
 */
export interface UserSession {
  id: string,
  isAdmin: boolean,
}

/**
 * Extend the Request interface for express to allow attaching a user object
 */
declare global {
  namespace Express {
    interface Request {
      user?: UserSession
    }
  }
}

/**
 * User model interface
 */
export interface User extends Record<string, any> {
  email: string,
  password: string,
  isAdmin: boolean,
}

export interface UserDocument extends User, Document {
  comparePassword(password: string): Promise<boolean>,
}


/**
 * Album model interface
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

export interface AlbumDocument extends Album, Document {};
