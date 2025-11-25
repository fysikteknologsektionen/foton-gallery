/**
 * Interface for an image
 */
export interface Image {
  _id: string;
  filename: string;
  originalFilename: string;
}

/**
 * Interface for an album
 */
export interface Album {
  _id: string;
  name: string;
  slug: string;
  date: string;
  authors: string[];
  description?: string;
  images: Image[];
  thumbnail?: Image;
  tags?: string[];
}
