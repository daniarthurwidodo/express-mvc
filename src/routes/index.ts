import { Router } from 'express';
import userRoutes from './userRoutes';
import helloRoutes from './helloRoutes';

const router = Router();

// API routes
router.use('/api', userRoutes);
router.use('/api', helloRoutes);

export default router;
