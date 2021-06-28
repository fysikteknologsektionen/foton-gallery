/* eslint-disable no-invalid-this */
import {model, Schema} from 'mongoose';
import {Album} from '../interfaces';
import slug from 'slug';

const albumSchema = new Schema<Album>({
  name: {type: String, required: true},
  slug: {type: String},
  description: String,
  images: [String],
  authors: [String],
  date: {type: Date, required: true},
  thumbnail: {type: Schema.Types.ObjectId, ref: 'Album.images'},
});

albumSchema.index({date: -1, slug: 1}, {unique: true});

/**
 * Generates a name slug and saves it alongside the name
 */
albumSchema.pre('save', function(next) {
  const nameSlug = slug(this.name);
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

export const AlbumModel = model<Album>('Album', albumSchema);
