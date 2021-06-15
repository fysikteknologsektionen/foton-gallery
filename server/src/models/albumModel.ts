import { model, Model, Schema } from 'mongoose';
import { Album } from '../types';
import slug from 'slug';

const albumSchema: Schema<Album> = new Schema<Album>({
  name: { type: String, required: true },
  slug: { type: String },
  description: String,
  images: [String],
  authors: [String],
  date: {type: Date, required: true },
  thumbnail: { type: Schema.Types.ObjectId, ref: 'Album.images' }
});

albumSchema.index({ date: -1, slug: 1 }, { unique: true });

/**
 * Generates a name slug and saves it alongside the name
 */
albumSchema.pre('save', function(next) {
  const nameSlug: string = slug(this.name);
  this.slug = nameSlug;
  next();
});

albumSchema.post('updateOne', function(doc: Album, next) {
  /** TODO: remove image files when updating album to delete images */
  next();
});

albumSchema.post('remove', function(doc: Album, next) {
  /** TODO: remove image files when deleting album */
  next();
});

export const AlbumModel: Model<Album> = model('Album', albumSchema);