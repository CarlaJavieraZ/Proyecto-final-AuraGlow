import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, foto_perfil } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        error: "Nombre, apellido, email y password son obligatorios",
      });
    }

    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        error: "El correo ya está registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (nombre, apellido, email, password, foto_perfil)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, apellido, email, foto_perfil, created_at`,
      [nombre, apellido, email, hashedPassword, foto_perfil || null]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user,
    });
  } catch (error) {
    console.error("Error en register:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password son obligatorios",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        foto_perfil: user.foto_perfil,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, rol, nombre, apellido, email, foto_perfil, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en profile:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};