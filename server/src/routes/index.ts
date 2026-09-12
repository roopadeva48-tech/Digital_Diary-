import { Router } from 'express';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import pageRoutes from './pageRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Digital Diary API is operational',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/categories', pageRoutes);
router.use('/ai', aiRoutes);

export default router;
