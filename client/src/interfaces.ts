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
