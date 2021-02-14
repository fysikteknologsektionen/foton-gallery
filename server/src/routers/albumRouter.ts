import { Router } from 'express';
import { createAlbum, deleteAlbum, getAlbums, updateAlbum } from '../controllers/albumController';

const router: Router = Router();

router.post('/', createAlbum);
router.get('/', getAlbums);
router.put('', updateAlbum);
router.delete('/', deleteAlbum);

export default router;