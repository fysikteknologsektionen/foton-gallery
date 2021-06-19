import '../db';
import { Album, User } from '../types';
import fs from 'fs';
import path from 'path';
import { AlbumModel } from '../models';
import { processImages } from '../utils/processImages';

const userData: Partial<User> = {
  email: 'foo@bar.com',
  password: 'admin',
  isAdmin: true
};

const albumData: Partial<Album>[] = [
  {
    name: 'Example album 1',
    description: 'This is an example album containing example images. 😀',
    authors: ['Foo Barsson', 'Bar Fooson'],
    date: new Date(1),
    images: ['album1']
  },
  {
    name: 'Example album 2',
    description: 'This is another example album containing example images. 🎨',
    authors: ['Foobar Foobarson'],
    date: new Date(5),
    images: ['album2']
  },
  {
    name: 'Example album 3',
    description: 'This is yet another example album containing example images. 🔥',
    authors: ['Barfoo Barfooson'],
    date: new Date(12),
    images: ['album3']
  },
  {
    name: 'Example album 4',
    description: 'This is even another example album containing example images. ✨',
    authors: ['Foofoo BarBarson', 'Barbar FooFooson'],
    date: new Date(29),
    images: ['album4']
  }
]

function createExampleAlbums () {
  try {
    const promises = albumData.map(async (data) => {
      const imagePath = path.join(__dirname, 'images', data.images![0]);
      data.images = fs.readdirSync(imagePath);
      const album: Album = new AlbumModel({ ...data });
      await album.save();
      processImages(data.images.map(image => ({ 
        path: path.join(imagePath, image),
        destination: path.join(__dirname, '..', '..', 'images'),
        filename: image
      } as Express.Multer.File)));
    });
    Promise.all(promises).then(_ => process.exit());
  } catch (error) {
    console.error(error);
  }
}

if (require.main == module) {
  console.log('Attempting to creating example albums...');
  createExampleAlbums();
}
else {
  console.error('For security reasons this script can only be run directly.');
}