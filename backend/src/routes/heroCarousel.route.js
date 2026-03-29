import express from "express";
import { Router } from 'express';
const router = Router();
import asyncHandler from '../utils/asyncHandler.js';
import upload from '../middleware/multer.js';
import { verifyJWT, isAdmin } from '../middleware/authentication.js';

import {
createSlide,
getSlides,
updateSlide,
deleteSlide
} from "../controllers/heroCarousel.controller.js";

// CREATE (with image)
router.post("/", verifyJWT,isAdmin, upload.single("image"), asyncHandler(createSlide));
// GET
router.get("/", asyncHandler(getSlides));
// UPDATE (image optional)
router.put("/:id",verifyJWT,isAdmin, upload.single("image"), asyncHandler(updateSlide));
// DELETE
router.delete("/:id",verifyJWT,isAdmin, asyncHandler(deleteSlide));


export default router;