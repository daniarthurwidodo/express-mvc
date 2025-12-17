import { Router } from 'express';
import { HelloController } from '../controllers/HelloController';

const router = Router();
const helloController = new HelloController();

// Hello routes
router.get('/hello', helloController.hello.bind(helloController));
router.get('/hello/personalized/:name', helloController.personalizedHello.bind(helloController));
router.get('/hello/random', helloController.randomHello.bind(helloController));
router.get('/hello/languages', helloController.getSupportedLanguages.bind(helloController));

export default router;
