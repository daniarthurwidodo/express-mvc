import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// API routes
router.use('/api', userRoutes);

export default router;
