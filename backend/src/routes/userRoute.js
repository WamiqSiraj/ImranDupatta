import express from 'express';
import { Router } from 'express';
const router = Router();
import asyncHandler from '../utils/asyncHandler.js';
import { registerUser, loginUser, logOutUser, refreshAccessToken } from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
import {verifyJWT} from '../middleware/authentication.js';

router.post('/register', upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), asyncHandler(registerUser))
router.post('/login' ,asyncHandler(loginUser))
router.post('/logout', verifyJWT ,asyncHandler(logOutUser))
router.post('/refreshToken', verifyJWT ,asyncHandler(refreshAccessToken))

export default router;