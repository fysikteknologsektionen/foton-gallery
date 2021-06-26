/* eslint-disable no-unused-vars */
import {Document} from 'mongoose';

/**
 * Interfaced used by express backend to represent an authenticated user
 */
export interface UserInfo {
  id: string,
  isAdmin: boolean
}

/**
 * Extend the Request interface for express to allow attaching a user object
 */
declare global {
  namespace Express {
    interface Request {
      user?: UserInfo
    }
  }
}

/**
 * User model interface
 */
export interface User extends Document {
  email: string,
  password: string,
  isAdmin: boolean,
  comparePassword(password: string): Promise<boolean>
}

/**
 * Album model interface
 */
export interface Album extends Document {
  name: string,
  slug: string,
  description?: string,
  images?: Array<string>,
  authors?: Array<string>,
  date?: Date,
  thumbnail?: string
}
