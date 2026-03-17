import pool from "../config/db.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT f.id, p.id AS product_id, p.nombre, p.precio, p.imagen_url
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getFavorites:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        error: "product_id es obligatorio",
      });
    }

    const result = await pool.query(
      `INSERT INTO favorites (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [userId, product_id]
    );

    res.status(201).json({
      message: "Producto agregado a favoritos",
    });
  } catch (error) {
    console.error("Error en addFavorite:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await pool.query(
      `DELETE FROM favorites
       WHERE user_id = $1 AND product_id = $2
       RETURNING *`,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Favorito no encontrado",
      });
    }

    res.status(200).json({
      message: "Producto eliminado de favoritos",
    });
  } catch (error) {
    console.error("Error en removeFavorite:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};