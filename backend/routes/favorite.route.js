import express from "express";
import { addFavorite, getFavorites, removeFavorite, } from "../controllers/favorite.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getFavorites);
router.post("/", verifyToken, addFavorite);
router.delete("/:productId", verifyToken, removeFavorite);

export default router;