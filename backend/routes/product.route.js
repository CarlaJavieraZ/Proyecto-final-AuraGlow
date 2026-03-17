import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, } from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, verifyRole("admin"), createProduct);
router.put("/:id", verifyToken, verifyRole("admin"), updateProduct);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteProduct);

export default router;