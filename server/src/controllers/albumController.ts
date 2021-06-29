import {NextFunction, Request, Response} from 'express';
import {matchedData} from 'express-validator';
import {Album} from '../interfaces';
import {AlbumModel} from '../models';
import {deleteImages} from '../utils/deleteImages';
import {processImages} from '../utils/processImages';

/**
 * Creates a new album
 * @param req Express request object containing album key-value data
 * @param res Express response object
 * @param next Express next function
 */
export async function createAlbum(req: Request, res: Response, next: NextFunction) {
  const data = matchedData(req) as Album;
  try {
    const album = new AlbumModel({...data});
    const result = await album.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Adds images to an existing album
 * @param req Express request object containing album id and images to add
 * @param res Express response object
 * @param next Express next function
 */
export async function addImages(req: Request, res: Response, next: NextFunction) {
  const {id} = matchedData(req) as {id: string};
  // Since we use Multer.array() we can guarantee req.files is an array
  const files = req.files as Express.Multer.File[];
  const fileNames = files.map((file) => file.filename);
  try {
    const album = await AlbumModel.findById(id).exec();
    if (!album) {
      throw new Error('Album does not exist.');
    }
    if (album.images) {
      album.images = album.images.concat(fileNames);
    } else {
      album.images = fileNames;
    }
    const result = await album.save();
    processImages(files);
    res.status(201).json(result.images);
  } catch (error) {
    /* TODO: Remove image files if error is thrown */
    next(error);
  }
}

/**
 * Gets a subset of albums based on some search parameters
 * @param req Express request object containing (optional) search parameters
 * @param res Express response object
 * @param next Express next function
 */
export async function getAlbums(req: Request, res: Response, next: NextFunction) {
  const {limit, offset, slug, date} = matchedData(req) as {
    limit?: number,
    offset?: number,
    slug?: string,
    date?: Date
  };
  try {
    const query = AlbumModel.find().sort('-dates');
    // Build the query dynamically from search parameters
    if (limit) {
      query.limit(limit);
    } else {
      // Default limit if not set
      query.limit(24);
    }
    if (offset) {
      query.skip(offset);
    }
    if (slug) {
      query.where('slug').equals(slug);
    }
    if (date) {
      query.where('date').equals(date);
    }
    const albums = await query.exec();
    res.json(albums);
  } catch (error) {
    next(error);
  }
}

/**
 * (Partially) updates an album
 * @param req Expres request object containing ID of the album and key-values to update
 * @param res Express response object
 * @param next Express next function
 */
export async function updateAlbum(req: Request, res: Response, next: NextFunction) {
  const {id, images, thumbnail, ...rest} = matchedData(req) as {id: string} & Partial<Album>;
  try {
    const album = await AlbumModel.findById(id);
    if (!album) {
      throw new Error('Album does not exist.');
    }
    if (images) {
      // Do not allow adding new images via this endpoint
      const newImages = images?.filter((x) => !album.images?.includes(x));
      if (newImages.length) {
        throw new Error('Cannot add new images.');
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
        throw new Error('Album must contain image selected as thumbnail.');
      }
      album.thumbnail = thumbnail;
    }
    // Update remaining properties
    for (const [key, value] of Object.entries(rest)) {
      album[key] = value;
    }
    const result = await album.save();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an album
 * @param req Express request object containing ID of the album
 * @param res Express response object
 * @param next Express next function
 */
export async function deleteAlbum(req: Request, res: Response, next: NextFunction) {
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
