import { Router } from 'express';
import { body, param } from 'express-validator';
import { createLead, deleteLead, getLeads, updateLead } from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const budgets = ['<$500', '$500-$1000', '$1000-$5000', '>$5000'];
const leadRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('budget').isIn(budgets).withMessage('Select a budget range.'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be 10–1000 characters.'),
];
router.post('/', leadRules, validate, createLead);
router.get('/', requireAuth, getLeads);
router.patch('/:id', requireAuth, [param('id').isMongoId(), body('status').isIn(['New', 'Contacted', 'Closed']).withMessage('Select a valid status.')], validate, updateLead);
router.delete('/:id', requireAuth, [param('id').isMongoId()], validate, deleteLead);
export default router;
