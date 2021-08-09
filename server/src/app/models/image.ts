/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';
import {deleteImage, processImage} from '../utils';

import {Image} from '../../interfaces';

const imageSchema = new Schema<Image>({
  filename: {type: String, required: true},
  originalFilename: {type: String, required: true},
});

/**
 * Processes image after saving it
 */
imageSchema.post<Image>('save', async function(doc) {
  await processImage(doc);
});

/**
 * Removes files from disk when removing image
 */
imageSchema.pre<Image>(
    'deleteOne',
    {document: true, query: false},
    async function() {
      await deleteImage(this);
    },
);

const imageModel = model<Image>('Image', imageSchema);
export {imageModel as Image};
