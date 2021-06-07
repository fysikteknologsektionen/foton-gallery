import { Router } from 'express';
import { albumController } from '../controllers';

export const albumRouter: Router = Router();

albumRouter.post('/', albumController.createAlbum);
albumRouter.get('/', albumController.getAlbums);
albumRouter.put('', albumController.updateAlbum);
albumRouter.delete('/', albumController.deleteAlbum);