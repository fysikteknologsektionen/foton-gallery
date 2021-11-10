import {Image} from '../../interfaces';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

/**
 * Processes full sized image into scaled down versions
 * @param image Image to process
 */
export async function processImage(image: Image): Promise<void> {
  const basePath = path.join(__dirname, '..', '..', '..', 'images');
  try {
    // Create thumbnail
    await sharp(path.join(basePath, image.originalFilename))
        .rotate()
        .resize(420, null, {
          fit: 'inside',
        })
        .toFormat('jpg', {progressive: true})
        .toFile(path.join(basePath, 'thumbnail', image.filename));
    // Create scaled down version for web
    await sharp(path.join(basePath, image.originalFilename))
        .rotate()
        .resize(1920, 1080, {
          fit: 'inside',
        })
        .toFormat('jpg', {quality: 100, progressive: true})
        .toFile(path.join(basePath, 'scaled', image.filename));
    // Move fullsized image
    await fs.rename(
        path.join(basePath, image.originalFilename),
        path.join(basePath, 'fullsize', image.originalFilename),
    );
  } catch (error) {
    console.error(error);
  }
}

/**
 * Deletes image from disk
 * @param image Image to delete
 */
export async function deleteImage(image: Image): Promise<void> {
  const basePath = path.join(__dirname, '..', '..', '..', 'images');
  try {
    await fs.unlink(path.join(basePath, 'fullsize', image.originalFilename));
    await fs.unlink(path.join(basePath, 'thumbnail', image.filename));
    await fs.unlink(path.join(basePath, 'scaled', image.filename));
  } catch (error) {
    console.error(error);
  }
}
