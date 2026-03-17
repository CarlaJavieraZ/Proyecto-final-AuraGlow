import pool from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, stock, categoria, imagen_url, created_at
       FROM products
       ORDER BY id ASC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getAllProducts:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, stock, categoria, imagen_url, created_at
       FROM products
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en getProductById:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Nombre, precio y stock son obligatorios",
      });
    }

    const result = await pool.query(
      `INSERT INTO products (nombre, descripcion, precio, stock, categoria, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nombre, descripcion, precio, stock, categoria, imagen_url, created_at`,
      [
        nombre,
        descripcion || null,
        precio,
        stock,
        categoria || null,
        imagen_url || null,
      ]
    );

    return res.status(201).json({
      message: "Producto creado correctamente",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createProduct:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

    const existingProduct = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const current = existingProduct.rows[0];

    const result = await pool.query(
      `UPDATE products
       SET nombre = $1,
           descripcion = $2,
           precio = $3,
           stock = $4,
           categoria = $5,
           imagen_url = $6
       WHERE id = $7
       RETURNING id, nombre, descripcion, precio, stock, categoria, imagen_url, created_at`,
      [
        nombre ?? current.nombre,
        descripcion ?? current.descripcion,
        precio ?? current.precio,
        stock ?? current.stock,
        categoria ?? current.categoria,
        imagen_url ?? current.imagen_url,
        id,
      ]
    );

    return res.status(200).json({
      message: "Producto actualizado correctamente",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateProduct:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING id, nombre`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      message: "Producto eliminado correctamente",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error en deleteProduct:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};