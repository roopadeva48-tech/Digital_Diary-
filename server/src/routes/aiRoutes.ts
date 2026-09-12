import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/prompt', optionalAuth, aiController.getPrompt);
router.post('/assist', optionalAuth, aiController.assist);
router.post('/mood', optionalAuth, aiController.analyzeMood);

export default router;
