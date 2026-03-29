import express from "express"
import { Router } from 'express';
const router = Router();
import { verifyJWT, isAdmin, softAuth } from '../middleware/authentication.js';
import asyncHandler from "../utils/asyncHandler.js";
import { placeOrder, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';

// User Route
router.post('/place-order',softAuth ,asyncHandler(placeOrder));

// Admin Routes (You can add an isAdmin check here later)
router.get('/admin/all-orders', verifyJWT, isAdmin, asyncHandler(getAllOrders));
router.put('/admin/update-status/:orderId', verifyJWT, isAdmin, asyncHandler(updateOrderStatus));

export default router;