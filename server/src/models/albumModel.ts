import { model, Model, Schema } from 'mongoose';
import { Album } from '../types';
import slug from 'slug';

const albumSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  images: [String],
  authors: [String],
  dates: [Date],
  thumbnail: { type: Schema.Types.ObjectId, ref: 'Album.images' }
});

albumSchema.pre<Album>('save', function(next) {
  const album: Album = this;
  const nameSlug: string = slug(album.name);
  album.slug = nameSlug;
  next();
});

albumSchema.post<Album>('updateOne', function(doc: Album, next) {
  /** TODO: remove image files when updating album to delete images */
  next();
});

albumSchema.post<Album>('remove', function(doc: Album, next) {
  /** TODO: remove image files when deleting album */
  next();
});

const AlbumModel: Model<Album> = model('Album', albumSchema);

export default AlbumModel;