import { Router } from 'express';
import { pageController } from '../controllers/pageController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/:categoryId/pages', optionalAuth, pageController.savePage);
router.delete('/:categoryId/pages/:pageId', optionalAuth, pageController.deletePage);

export default router;
