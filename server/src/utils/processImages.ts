import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';

/**
 * Processes full sized images into scaled down versions
 * @param images Multer image instances to process
 * @throws Throws an error if sharp or file system operations fail
 */
export function processImages(images: Express.Multer.File[]) {
  images.forEach(async (image) => {
    // Create preview thumbnails
    await sharp(image.path)
        .resize(420, null, {
          fit: 'inside',
        })
        .toFile(path.join(image.destination, 'thumbnail', image.filename));
    // Create scaled (down) image for web
    await sharp(image.path)
        .resize(1920, 1080, {
          fit: 'inside',
        })
        .toFile(path.join(image.destination, 'scaled', image.filename));
    // Move fullsize images
    await fs.rename(image.path, path.join(image.destination, 'fullsize', image.filename));
  });
}
