import express from "express";
import multer from "multer";

import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload.single('imageFile'), createProduct);
router.put('/:id', upload.single('imageFile'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;