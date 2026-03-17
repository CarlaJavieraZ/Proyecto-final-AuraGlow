import pool from "../config/db.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
          ci.id,
          ci.product_id,
          ci.quantity,
          p.nombre,
          p.descripcion,
          p.precio,
          p.imagen_url,
          (ci.quantity * p.precio) AS subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.id ASC`,
      [userId]
    );

    const items = result.rows;

    const total = items.reduce(
      (acc, item) => acc + Number(item.subtotal),
      0
    );

    return res.status(200).json({
      items,
      total,
    });
  } catch (error) {
    console.error("Error en getCart:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(400).json({
        error: "product_id es obligatorio",
      });
    }

    const qty = quantity && quantity > 0 ? quantity : 1;

    const productResult = await pool.query(
      "SELECT id, stock FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const product = productResult.rows[0];

    const existingItem = await pool.query(
      `SELECT * FROM cart_items
       WHERE user_id = $1 AND product_id = $2`,
      [userId, product_id]
    );

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + qty;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          error: "La cantidad solicitada supera el stock disponible",
        });
      }

      const updated = await pool.query(
        `UPDATE cart_items
         SET quantity = $1
         WHERE user_id = $2 AND product_id = $3
         RETURNING *`,
        [newQuantity, userId, product_id]
      );

      return res.status(200).json({
        message: "Cantidad del producto actualizada en el carrito",
        item: updated.rows[0],
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        error: "La cantidad solicitada supera el stock disponible",
      });
    }

    const inserted = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, product_id, qty]
    );

    return res.status(201).json({
      message: "Producto agregado al carrito",
      item: inserted.rows[0],
    });
  } catch (error) {
    console.error("Error en addToCart:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        error: "La cantidad debe ser mayor a 0",
      });
    }

    const productResult = await pool.query(
      "SELECT id, stock FROM products WHERE id = $1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const product = productResult.rows[0];

    if (quantity > product.stock) {
      return res.status(400).json({
        error: "La cantidad solicitada supera el stock disponible",
      });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE user_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado en el carrito",
      });
    }

    return res.status(200).json({
      message: "Cantidad actualizada correctamente",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateCartItemQuantity:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await pool.query(
      `DELETE FROM cart_items
       WHERE user_id = $1 AND product_id = $2
       RETURNING *`,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado en el carrito",
      });
    }

    return res.status(200).json({
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    console.error("Error en removeCartItem:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM cart_items
       WHERE user_id = $1`,
      [userId]
    );

    return res.status(200).json({
      message: "Carrito vaciado correctamente",
    });
  } catch (error) {
    console.error("Error en clearCart:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};