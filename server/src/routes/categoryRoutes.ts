import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, categoryController.getAll);
router.get('/:id', optionalAuth, categoryController.getById);
router.post('/', optionalAuth, categoryController.create);
router.put('/:id', optionalAuth, categoryController.update);
router.delete('/:id', optionalAuth, categoryController.delete);

export default router;
