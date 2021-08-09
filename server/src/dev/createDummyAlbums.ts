import '../config';

import {Album, Image} from '../app/models';

import {Image as IImage} from '../interfaces';
import cryptoRandomString from 'crypto-random-string';
import faker from 'faker';
import fs from 'fs/promises';
import path from 'path';

/**
 * Creates dummy albums
 * @param numAlbums Number of albums to create
 * @param numImages Number of images in each album to create
 */
async function createDummyAlbums(numAlbums: number, numImages: number) {
  console.log('Creating dummy albums (this may take a moment)...');

  const imagesDir = path.join(__dirname, 'images');
  const files = await fs.readdir(imagesDir);
  for (let i = 0; i < numAlbums; i++) {
    try {
      // Select 16 random elements from files
      const images = faker.random.arrayElements(files, numImages);

      // Copy files and rename them
      const newFileNames = [];
      for (const image of images) {
        const newFileName =
          cryptoRandomString({length: 32}) + path.extname(image);
        await fs.copyFile(
            path.join(imagesDir, image),
            path.join(__dirname, '..', '..', 'images', newFileName),
        );
        newFileNames.push(newFileName);
      }
      const imageDocs: IImage[] = [];
      for (let i = 0; i < newFileNames.length; i++) {
        const filename = newFileNames[i];
        const imageDoc = new Image({
          filename: filename,
          originalFilename: filename,
        });
        await imageDoc.save();
        imageDocs.push(imageDoc);
      }

      const albumData = {
        name: faker.lorem.words(3),
        date: faker.date.past(10).toISOString().substring(0, 10),
        authors: Array.from({length: faker.datatype.number(3)}, () =>
          faker.name.findName(),
        ),
        description: faker.lorem.paragraphs(1),
        images: imageDocs,
        thumbnail: faker.random.arrayElement(imageDocs),
      };

      const album = new Album({...albumData});
      await album.save();
    } catch (error) {
      console.error(error);
    }
  }
  process.exit(0);
}

if (require.main == module) {
  const args = process.argv.slice(2);
  const numAlbums = Number(args[0]);
  const numImages = Number(args[1]);

  if (!numAlbums || !numImages) {
    console.error('Invalid arguments. Usage:');
    console.error('> createDummyAlbums <# albums> <# images in each album>');
    process.exit(1);
  }

  createDummyAlbums(numAlbums, numImages);
} else {
  console.error('This file can only be run directly');
}
