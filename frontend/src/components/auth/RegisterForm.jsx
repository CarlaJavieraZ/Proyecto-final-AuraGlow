import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const response = await register({
      nombre,
      apellido,
      email,
      password,
    });

    if (response.success) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNombre("");
      setApellido("");
      setError("");
      navigate("/login");
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="auth-box">
          <h2 className="auth-title mb-2 text-center">Crear cuenta</h2>
          <p className="auth-subtitle mb-4 text-center">
            Regístrate para guardar tus favoritos y continuar tus compras.
          </p>

          {error && (
            <div className="alert alert-danger p-2" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="auth-label" htmlFor="nombre">
                Nombre
              </label>
              <input
                type="text"
                className="form-control auth-input"
                id="nombre"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-label" htmlFor="apellido">
                Apellido
              </label>
              <input
                type="text"
                className="form-control auth-input"
                id="apellido"
                placeholder="Ingresa tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control auth-input"
                id="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-label" htmlFor="password">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control auth-input"
                id="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-label" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="form-control auth-input"
                id="confirmPassword"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn auth-btn">
              Registrarse
            </button>
          </form>

          <p className="auth-link-text text-center mt-4 mb-0">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;