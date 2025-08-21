import {Album, Image} from '../models';
import {ConflictError, NotFoundError} from '../errors';
import {NextFunction, Request, Response} from 'express';

import {Album as IAlbum} from '../../interfaces';
import {matchedData} from 'express-validator';

/**
 * Creates a new album
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function createAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const data = matchedData(req) as IAlbum;
  try {
    const album = new Album({...data});
    await album.save();
    res.status(201).json(album);
  } catch (error) {
    // Catch duplicate key error
    if (error.code === 11000) {
      next(
          new ConflictError(`Album with name ${data.name} and
            date ${data.date} already exists`),
      );
      return;
    }
    next(error);
  }
}

/**
 * Updates an album's meta information
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function updateAlbumMeta(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, ...data} = matchedData(req, {includeOptionals: true}) as {
    id: string;
  } & IAlbum;
  try {
    const album = await Album.findById(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    album.set(data);
    await album.save();
    res.status(200).json(album);
  } catch (error) {
    // Catch duplicate key error
    if (error.code === 11000) {
      next(
          new ConflictError(`Album with name ${data.name} and
            date ${data.date} already exists`),
      );
      return;
    }
    next(error);
  }
}

/**
 * Gets a specific album from slug and date
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const data = matchedData(req) as {date: Date; slug: string};
  try {
    const album = await Album.findOne({...data})
        .populate('images thumbnail')
        .exec();
    if (!album) {
      throw new NotFoundError(
          `Album with slug ${data.slug} and date ${data.date} not found`,
      );
    }
    res.json(album);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a subset of all albums sorted by date,
 * skipping empty albums if not signed in
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getAlbums(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const isSignedIn = !!req.user;

  const {count, page} = matchedData(req) as {count: number; page: number};
  try {
    const query = Album.find();
    const albums = await (isSignedIn ?
      query :
      query.where({
        'images.0': {
          '$exists': true,
        },
      }))
        .sort('-date')
        .limit(count)
        .skip((page - 1) * count)
        .populate('images thumbnail')
        .exec();
    res.json(albums);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets approximate album count
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getAlbumCount(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    const count = await Album.estimatedDocumentCount().exec();
    res.json(count);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an album
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function deleteAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  try {
    const album = await Album.findById(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    await album.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Creates an image and adds it to an album
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function addImageToAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  try {
    const album = await Album.findById(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    // Will always be defined since we use multer.single()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const file = req.file!;
    const image = new Image({
      filename: `${file.filename.slice(0, file.filename.lastIndexOf('.'))}.jpg`,
      originalFilename: file.filename,
    });
    const imageDoc = await image.save();
    album.images.push(imageDoc);
    await album.save();
    res.status(201).json(imageDoc);
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an album's images (order) and thumbnail
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function updateAlbumImages(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, ...data} = matchedData(req) as {
    id: string;
    images: string[];
    thumbnail: string;
  };
  try {
    const album = await Album.findById(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    // Check for removed images
    for (let i = 0; i < album.images.length; i++) {
      const image = album.images[i];
      // We must explicity cast to string since we cannot
      // compare ObjectId to string
      if (image && !data.images.includes(image.toString())) {
        const imageDoc = await Image.findById(image).exec();
        if (imageDoc) {
          await imageDoc.deleteOne();
        }
      }
    }
    album.set(data);
    await album.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
