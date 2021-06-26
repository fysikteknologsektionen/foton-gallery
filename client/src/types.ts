export interface Album {
  name: string,
  slug: string,
  description?: string,
  images?: Array<string>,
  authors?: Array<string>,
  date?: Date,
  thumbnail?: string
}
