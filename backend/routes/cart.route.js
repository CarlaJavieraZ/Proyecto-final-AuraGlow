import express from "express";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItemQuantity, } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/:productId", verifyToken, updateCartItemQuantity);
router.delete("/:productId", verifyToken, removeCartItem);
router.delete("/", verifyToken, clearCart);

export default router;