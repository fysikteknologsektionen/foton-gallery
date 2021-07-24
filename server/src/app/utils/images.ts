import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

/**
 * Processes full sized image into scaled down versions
 * @param image Image to process
 * @throws Throws an error if sharp or file system operations fail
 */
export async function processImage(image: Express.Multer.File): Promise<void> {
  // Create thumbnails
  await sharp(image.path)
      .resize(420, null, {
        fit: 'inside',
      })
      .toFile(path.join(image.destination, 'thumbnail', image.filename));
  // Create scaled down version for web
  await sharp(image.path)
      .resize(1920, 1080, {
        fit: 'inside',
      })
      .toFile(path.join(image.destination, 'scaled', image.filename));
  // Move fullsize images
  await fs.rename(
      image.path,
      path.join(image.destination, 'fullsize', image.filename),
  );
}

/**
 * Deletes images from disk
 * @param imageFileNames File names of images to delete
 * @throws Throws an error if file system operations fail
 */
export async function deleteImages(imageFileNames: string[]): Promise<void> {
  const imageDir = path.join(__dirname, '..', '..', '..', 'images');
  for (let i = 0; i < imageFileNames.length; i++) {
    const file = imageFileNames[i];
    await fs.unlink(path.join(imageDir, 'fullsize', file));
    await fs.unlink(path.join(imageDir, 'thumbnail', file));
    await fs.unlink(path.join(imageDir, 'scaled', file));
  }
}
