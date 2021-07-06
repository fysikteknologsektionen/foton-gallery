/**
 * User session interface
 */
export interface UserSession {
  _id: string,
  isAdmin: boolean,
}

/**
 * User interface
 */
export interface User {
  _id: string,
  username: string,
  isAdmin: boolean,
}

/**
 * Album interface
 */
export interface Album {
  _id: string,
  name: string,
  slug: string,
  description?: string,
  images?: string[],
  authors?: string[],
  date: string,
  thumbnail?: string
}
