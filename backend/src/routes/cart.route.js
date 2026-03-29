import express from 'express';
import { Router } from 'express';
const router = Router();
import asyncHandler from '../utils/asyncHandler.js';
import { verifyJWT, softAuth } from '../middleware/authentication.js';
import { getCart, addToCart, removeFromCart, updateQuantity } from '../controllers/cart.controller.js';

router.get('/getCart',softAuth ,asyncHandler(getCart))
router.post('/addToCart',softAuth, asyncHandler(addToCart))
router.delete('/removeFromCart/:productId', softAuth, asyncHandler(removeFromCart))
router.put('/updateQuantity', softAuth, asyncHandler(updateQuantity))


export default router;