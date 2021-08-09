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
imageSchema.post('save', async function(doc: Image) {
  await processImage(doc);
});

/**
 * Removes files from disk when removing image
 */
imageSchema.post('remove', async function(doc: Image) {
  await deleteImage(doc);
});

const imageModel = model<Image>('Image', imageSchema);
export {imageModel as Image};
