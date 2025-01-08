import express from 'express';
import resourceRouter from './resourceRoutes';
import roadmapRouter from './roadmapRoutes';
import authRouter from './authRoutes';

const router = express.Router();

// API routes
router.use('/api/resources', resourceRouter);
router.use('/api/roadmap', roadmapRouter);
router.use('/api/auth', authRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
