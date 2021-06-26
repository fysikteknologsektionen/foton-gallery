export interface Album {
  name: string,
  slug: string,
  description?: string,
  images?: string[],
  authors?: string[],
  date: string,
  thumbnail?: string
}
