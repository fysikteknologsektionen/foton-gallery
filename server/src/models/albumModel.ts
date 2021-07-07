/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';

import {AlbumDocument} from '../interfaces';
import slug from 'slug';

const albumSchema = new Schema<AlbumDocument>({
  name: {type: String, required: true},
  slug: String,
  date: {type: Date, required: true},
  authors: [String],
  description: String,
  images: [String],
  thumbnail: {type: Schema.Types.ObjectId, ref: 'Album.images'},
});

albumSchema.index({date: -1, slug: 1}, {unique: true});

/**
 * Generates a slug from then name and stores it
 */
albumSchema.pre('save', function(next) {
  const nameSlug = slug(this.name);
  this.slug = nameSlug;
  next();
});

export const AlbumModel = model<AlbumDocument>('Album', albumSchema);
