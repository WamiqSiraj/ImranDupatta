import express from 'express';
import { Router } from 'express';
const router = Router();
import asyncHandler from '../utils/asyncHandler.js';
import { verifyJWT, isAdmin } from '../middleware/authentication.js';
import { getCart, addToCart, removeFromCart, updateQuantity } from '../controllers/cart.controller.js';

router.get('/getCart',verifyJWT ,asyncHandler(getCart))
router.post('/addToCart',verifyJWT, asyncHandler(addToCart))
router.delete('/removeFromCart', verifyJWT, asyncHandler(removeFromCart))
router.put('/updateQuantity', verifyJWT, asyncHandler(updateQuantity))


export default router;