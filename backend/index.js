import dotenv from "dotenv";
import pool from "./config/db.js";
import app from "./app.js";

dotenv.config();

pool.query("SELECT NOW()")
  .then(() => {
    console.log(`Conexión a DB - PostgreSQL ${process.env.DB_NAME} exitosa`);
  })
  .catch((err) => {
    console.error("Error al conectar a PostgreSQL:", err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});