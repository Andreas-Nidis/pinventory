import express from "express";
const router = express.Router();

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

import dotenv from "dotenv";
dotenv.config();

import { 
    createProduct, 
    deleteProduct, 
    getProduct, 
    getProducts, 
    updateProduct 
} from "../controllers/productController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

router.get("/", authenticateUser, getProducts);
router.get("/:id", authenticateUser, getProduct);
router.post("/", authenticateUser, upload.single('imageFile'), createProduct);
router.put('/:id', authenticateUser, upload.single('imageFile'), updateProduct);
router.delete('/:id', authenticateUser, deleteProduct);

export default router;