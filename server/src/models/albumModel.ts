import { model, Model, Schema } from 'mongoose';
import { Album } from '../types';
import slug from 'slug';

const AlbumSchema: Schema<Album> = new Schema<Album>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  images: [String],
  authors: [String],
  dates: [Date],
  thumbnail: { type: Schema.Types.ObjectId, ref: 'Album.images' }
});

/**
 * Generates a name slug and saves it alongside the name
 */
AlbumSchema.pre('save', function(next) {
  const nameSlug: string = slug(this.name);
  this.slug = nameSlug;
  next();
});

AlbumSchema.post('updateOne', function(doc: Album, next) {
  /** TODO: remove image files when updating album to delete images */
  next();
});

AlbumSchema.post('remove', function(doc: Album, next) {
  /** TODO: remove image files when deleting album */
  next();
});

export const AlbumModel: Model<Album> = model('Album', AlbumSchema);