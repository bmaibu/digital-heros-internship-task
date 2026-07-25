import { Router } from 'express';
import { body } from 'express-validator';
import { login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.post('/login', [body('email').isEmail().withMessage('Enter a valid email.').normalizeEmail(), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')], validate, login);
router.get('/me', requireAuth, me);
export default router;
