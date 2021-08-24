import {Schema, model} from 'mongoose';

/* eslint-disable no-invalid-this */
import {Album} from '../../interfaces';
import {Image} from './image';
import slug from 'slug';

const albumSchema = new Schema<Album>({
  name: {type: String, required: true},
  slug: String,
  date: {type: Date, required: true},
  authors: [String],
  description: String,
  images: [{type: Schema.Types.ObjectId, ref: 'Image'}],
  thumbnail: {type: Schema.Types.ObjectId, ref: 'Image'},
});

albumSchema.index({date: -1, slug: 1}, {unique: true});

/**
 * Generates a slug from the name and stores it
 */
albumSchema.pre<Album>('save', function(next) {
  const nameSlug = slug(this.name);
  this.slug = nameSlug;
  next();
});

/**
 * Remove images when removing album
 */
albumSchema.post<Album>(
    'deleteOne',
    {document: true, query: false},
    async function() {
      for (let i = 0; i < this.images.length; i++) {
        const image = await Image.findById(this.images[i]).exec();
        if (image) {
          await image.deleteOne();
        }
      }
    },
);

const albumModel = model<Album>('Album', albumSchema);
export {albumModel as Album};
