import express from "express";
const router = express.Router();

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

import dotenv from "dotenv";
dotenv.config();

import { 
    createItem, 
    deleteItem, 
    getItem, 
    getItems, 
    updateItem 
} from "../controllers/ItemController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

router.get("/", authenticateUser, getItems);
router.get("/:id", authenticateUser, getItem);
router.post("/", authenticateUser, upload.single('imageFile'), createItem);
router.put('/:id', authenticateUser, upload.single('imageFile'), updateItem);
router.delete('/:id', authenticateUser, deleteItem);

export default router;