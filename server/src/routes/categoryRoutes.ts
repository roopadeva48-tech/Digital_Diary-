import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, categoryController.getAll);
router.get('/:id', requireAuth, categoryController.getById);
router.post('/', requireAuth, categoryController.create);
router.put('/:id', requireAuth, categoryController.update);
router.delete('/:id', requireAuth, categoryController.delete);

export default router;
