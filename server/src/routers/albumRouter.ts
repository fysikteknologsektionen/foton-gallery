import { Router } from 'express';
import { AlbumController } from '../controllers';

export const AlbumRouter: Router = Router();

AlbumRouter.post('/', AlbumController.createAlbum);
AlbumRouter.get('/', AlbumController.getAlbums);
AlbumRouter.put('', AlbumController.updateAlbum);
AlbumRouter.delete('/', AlbumController.deleteAlbum);