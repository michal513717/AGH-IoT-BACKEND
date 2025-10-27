import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { verifyLocalJwtToken } from '../middleware/auth';

const router = Router();

router.get('/test-tokens', AuthController.generateTestTokens);
router.get('/me', verifyLocalJwtToken, AuthController.getCurrentUser);

export default router;