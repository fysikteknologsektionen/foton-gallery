import '../config';

import {Album, Image} from '../app/models';
import {extname, join, normalize} from 'path';

import {Image as IImage} from '../interfaces';
import cryptoRandomString from 'crypto-random-string';
import fs from 'fs/promises';

/**
 * Migrates albums from the original Foton application
 * @param path Path to directory of albums
 */
async function migrateAlbums(path: string) {
  try {
    console.log('Migrating albums...');
    console.log('---');
    const dir = await fs.readdir(path);

    for (let index = 0; index < dir.length; index++) {
      const album = dir[index];
      if (!album) {
        continue;
      }
      console.log(`Migrating '${album}'...`);
      const meta = JSON.parse(
          await fs.readFile(join(path, album, 'meta.json'), 'utf8'),
      );
      const albumDir = await fs.readdir(join(path, album, 'fullsize'));
      delete albumDir[albumDir.indexOf('meta.json')];

      const images: IImage[] = [];
      for (const image of albumDir) {
        if (image) {
          const newFileName = cryptoRandomString({length: 32}) + extname(image);
          await fs.copyFile(
              join(path, album, 'fullsize', image),
              join(__dirname, '..', '..', 'images', newFileName),
          );
          const imageDoc = new Image({
            filename: `${newFileName.slice(
                0,
                newFileName.lastIndexOf('.'),
            )}.jpg`,
            originalFilename: newFileName,
          });
          await imageDoc.save();
          images.push(imageDoc);
        }
      }

      const newAlbum = new Album({
        name: meta.name,
        date: new Date(meta.date.split(',')[0]),
        authors: meta.author.split(','),
        description: meta.description,
        images: images,
        thumbnail: images[albumDir.indexOf(meta.thumbnail)],
      });
      await newAlbum.save();
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (require.main == module) {
  const args = process.argv.slice(2);

  if (!args[0]) {
    console.error('Invalid arguments. Usage:');
    console.error('> migrateAlbums <path to albums dir>');
    process.exit(1);
  }
  const path = normalize(args[0]);
  migrateAlbums(path);
} else {
  console.error('This file can only be run directly');
}
