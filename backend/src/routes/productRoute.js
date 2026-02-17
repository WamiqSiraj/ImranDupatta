import express from 'express';
import { Router } from 'express';
const router = Router();
import asyncHandler from '../utils/asyncHandler.js';
import { addProduct, getAllProduct, deleteProduct, updateProduct } from '../controllers/product.controller.js';
import upload from '../middleware/multer.js';
import { verifyJWT, isAdmin } from '../middleware/authentication.js';

router.post('/addProduct', verifyJWT, isAdmin, upload.array("productImg", 5), asyncHandler(addProduct))
router.get('/getAllProduct', asyncHandler(getAllProduct))
router.delete('/deleteProduct/:productId', verifyJWT, isAdmin, asyncHandler(deleteProduct))
router.put('/updateProduct/:productId', verifyJWT, isAdmin, upload.array("productImg", 5), asyncHandler(updateProduct))

export default router;