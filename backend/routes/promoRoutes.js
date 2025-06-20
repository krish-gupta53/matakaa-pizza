import express from 'express';
import { createPromoCode, getActivePromoCodes, getAllPromoCodes, validatePromoCode, updatePromoCode, deletePromoCode } from '../controllers/promoController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/admin', authMiddleware, createPromoCode);
router.get('/admin', authMiddleware, getAllPromoCodes);
router.put('/admin/:id', authMiddleware, updatePromoCode);
router.delete('/admin/:id', authMiddleware, deletePromoCode);

// Public routes
router.get('/', getActivePromoCodes);
router.post('/validate', validatePromoCode);

export default router; 