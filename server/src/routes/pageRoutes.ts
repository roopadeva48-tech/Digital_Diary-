import { Router } from 'express';
import { pageController } from '../controllers/pageController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/:categoryId/pages', requireAuth, pageController.savePage);
router.delete('/:categoryId/pages/:pageId', requireAuth, pageController.deletePage);

export default router;
