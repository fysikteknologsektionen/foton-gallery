export interface Album extends Record<string, string | string[] | undefined> {
  _id: string,
  name: string,
  slug: string,
  description?: string,
  images?: string[],
  authors?: string[],
  date: string,
  thumbnail?: string
}
