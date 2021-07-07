import {EntryNotFoundError, ValidationError} from '../errors';
import {NextFunction, Response} from 'express';

import {AlbumModel} from '../models';
import {Request} from '../interfaces';
import {deleteImages} from '../utils/deleteImages';
import {matchedData} from 'express-validator';
import {processImages} from '../utils/processImages';

/**
 * Creates a new album
 * @param req Express request object containing album key-value data
 * @param res Express response object
 * @param next Express next function
 */
export async function createAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const data = matchedData(req) as {
    name: string,
    date: Date,
    authors: string[],
    description: string,
  };
  try {
    const album = new AlbumModel({...data});
    const result = await album.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an album's information (not images/thumbnail)
 * @param req Express request object containing id and data to update
 * @param res Express response object
 * @param next Express next function
 */
export async function updateAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, ...data} = matchedData(req) as {
    id: string,
    name: string,
    date: Date,
    authors?: string[],
    description?: string,
  };
  try {
    const album = await AlbumModel.findById(id);
    if (!album) {
      throw new EntryNotFoundError('Album cannot be found.');
    }
    album.set(data);
    await album.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a specific album from date and slug
 * @param req Express request object containing date and slug
 * @param res Express response object
 * @param next Express next function
 */
export async function getAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {date, slug} = matchedData(req) as {
  date: Date,
  slug: string,
};
  try {
    const album = await AlbumModel.findOne({date: date, slug: slug}).exec();
    res.json(album);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a subset of all albums
 * @param req Express request object containing limit and offset
 * @param res Express response object
 * @param next Express next function
 */
export async function getAlbums(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {limit, offset} = matchedData(req) as {
    limit: number,
    offset: number,
  };
  try {
    const albums = await AlbumModel.find().sort('-dates')
        .limit(limit).skip(offset).exec();
    res.json(albums);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an album
 * @param req Express request object containing id of the album
 * @param res Express response object
 * @param next Express next function
 */
export async function deleteAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  try {
    const album = await AlbumModel.findByIdAndDelete(id).exec();
    if (album?.images?.length) {
      deleteImages(album.images);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Adds images to an album
 * @param req Express request object containing album id and images to add
 * @param res Express response object
 * @param next Express next function
 */
export async function addImages(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  // Since we use Multer.array() we can guarantee req.files is an array
  const files = req.files as Express.Multer.File[];
  const fileNames = files.map((file) => file.filename);
  try {
    const album = await AlbumModel.findById(id).exec();
    if (!album) {
      throw new EntryNotFoundError('Album cannot be found.');
    }
    if (album.images) {
      album.images = album.images.concat(fileNames);
    } else {
      album.images = fileNames;
    }
    await album.save();
    processImages(files);
    res.status(201).send();
  } catch (error) {
    // Delete images from system
    try {
      deleteImages(fileNames);
    } catch (error) {
      console.error(error);
    }
    next(error);
  }
}

/**
 * Updates an album's images & thumbnail (not any other information)
 * @param req Express request object containing album id and data to update
 * @param res Express response object
 * @param next Express next function
 */
export async function updateImages(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, images, thumbnail} = matchedData(req) as {
    id: string,
    images?: string[],
    thumbnail?: string,
  };
  try {
    const album = await AlbumModel.findById(id).exec();
    if (!album) {
      throw new EntryNotFoundError('Album cannot be found.');
    }
    if (images) {
      // Do not allow adding new images via this endpoint
      const newImages = images?.filter((x) => !album.images?.includes(x));
      if (newImages.length) {
        throw new ValidationError('Cannot add images.');
      }
      // Check for removed images
      const removedImages = album.images?.filter((x) => !images.includes(x));
      if (removedImages?.length) {
        album.images = images;
        try {
          deleteImages(removedImages);
        } catch (error) {
          console.error(error);
        }
      }
    }
    if (thumbnail) {
      // Make sure the selected thumbnail is an image of the album
      const validImages = images ? images : album.images;
      if (!validImages?.includes(thumbnail)) {
        throw new ValidationError('Thumbnail must belong to album.');
      }
      album.thumbnail = thumbnail;
    }
    await album.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
