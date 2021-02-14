import { Document } from 'mongoose';

export interface User extends Document {
  email: string,
  password: string
}

export interface Album extends Document {
  name: string,
  slug: string,
  description?: string,
  images?: Array<string>,
  authors?: Array<string>,
  dates?: Array<Date>,
  thumbnail?: string
}