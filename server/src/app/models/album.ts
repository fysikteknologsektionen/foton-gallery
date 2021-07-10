/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';

import {Album as IAlbum} from '../../interfaces';
import slug from 'slug';

const albumSchema = new Schema<IAlbum>({
  name: {type: String, required: true},
  slug: String,
  date: {type: Date, required: true},
  authors: [String],
  description: String,
  images: [String],
  thumbnail: Number,
});

albumSchema.index({date: -1, slug: 1}, {unique: true});

/**
 * Generates a slug from the name and stores it
 */
albumSchema.pre('save', function(next) {
  const nameSlug = slug(this.name);
  this.slug = nameSlug;
  next();
});

export const Album = model<IAlbum>('Album', albumSchema);
