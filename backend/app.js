import cors from "cors";
import express from "express";
import dotenv from "dotenv";


import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import favoriteRoute from "./routes/favorite.route.js";
import cartRoute from "./routes/cart.route.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/favorites", favoriteRoute);
app.use("/api/cart", cartRoute);

app.use((_, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;