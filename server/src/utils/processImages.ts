import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';

/**
 * Processes raw images into scaled down versions
 * @param {Express.Multer.File[]} images - Multer image instances to process
 * @return {Promise<any[]>}
 * @throws Throws an error if sharp or file system operations fail
 */
export function processImages(images: Express.Multer.File[]) {
  const promises: Promise<any>[] = [];
  images.forEach(async (image) => {
    promises.push(
        // Create preview thumbnails
        sharp(image.path)
            .resize(420, null, {
              fit: 'inside',
            })
            .toFile(path.join(image.destination, 'thumbnail', image.filename)),
        // Create scaled (down) image for web
        sharp(image.path)
            .resize(1920, 1080, {
              fit: 'inside',
            })
            .toFile(path.join(image.destination, 'scaled', image.filename)),
        // Move fullsize images
        fs.rename(image.path, path.join(image.destination, 'fullsize', image.filename)),
    );
  });
  return Promise.all(promises);
}
