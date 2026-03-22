import pool from "../config/db.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const result = await pool.query(
      `
      SELECT 
        f.id AS favorite_id,
        f.user_id,
        f.product_id,
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.categoria
      FROM favorites f
      INNER JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1
      ORDER BY f.id DESC
      `,
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("ERROR REAL getFavorites:", error);
    return res.status(500).json({
      error: error.message || "Error interno del servidor",
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    console.log("=== addFavorite ===");
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    console.log("req.user:", req.user);

    const userId = req.user?.id || req.user?.userId;
    const rawProductId =
      req.body?.product_id ?? req.body?.productId ?? req.params?.productId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (rawProductId === undefined || rawProductId === null || rawProductId === "") {
      return res.status(400).json({ error: "product_id es obligatorio" });
    }

    const productId = Number(rawProductId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: "product_id inválido" });
    }

    const productExists = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [productId]
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const favoriteExists = await pool.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (favoriteExists.rows.length > 0) {
      return res.status(200).json({ message: "El producto ya está en favoritos" });
    }

    const result = await pool.query(
      "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [userId, productId]
    );

    return res.status(201).json({
      message: "Producto agregado a favoritos",
      favorite: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR REAL addFavorite:", error);
    return res.status(500).json({
      error: error.message || "Error interno del servidor",
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const rawProductId =
      req.params?.product_id ?? req.params?.productId ?? req.body?.product_id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (rawProductId === undefined || rawProductId === null || rawProductId === "") {
      return res.status(400).json({ error: "product_id es obligatorio" });
    }

    const productId = Number(rawProductId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: "product_id inválido" });
    }

    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }

    return res.status(200).json({
      message: "Producto eliminado de favoritos",
      favorite: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR REAL removeFavorite:", error);
    return res.status(500).json({
      error: error.message || "Error interno del servidor",
    });
  }
};