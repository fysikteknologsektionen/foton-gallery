/**
 * Interface representing a user session as received from backend
 */
export interface UserSession {
  role: 'user' | 'admin';
}

/**
 * Interface representing a user
 */
export interface User {
  _id: string;
  username: string;
  role: 'user' | 'admin';
}

/**
 * Interface representing an album
 */
export interface Album {
  _id: string;
  name: string;
  slug: string;
  date: string;
  authors: string[];
  description?: string;
  images: string[];
  thumbnail?: string;
}
