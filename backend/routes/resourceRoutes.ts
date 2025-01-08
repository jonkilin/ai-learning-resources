import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  searchResources,
  rateResource,
  commentOnResource
} from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getResources);
router.get('/search', searchResources);
router.get('/:id', getResourceById);

// Protected routes
router.use(protect);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
router.post('/:id/rate', rateResource);
router.post('/:id/comments', commentOnResource);

export default router;
