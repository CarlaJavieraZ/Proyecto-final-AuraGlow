import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || "Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="auth-box">
          <h2 className="auth-title mb-2 text-center">Iniciar sesión</h2>
          <p className="auth-subtitle mb-4 text-center">
            Accede a tu cuenta para continuar comprando en Aura Glow.
          </p>

          {error && <div className="alert alert-danger p-2">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="auth-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-label">Contraseña</label>
              <input
                type="password"
                className="form-control auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button type="submit" className="btn auth-btn">
              Iniciar sesión
            </button>
          </form>

          <p className="auth-link-text text-center mt-4 mb-0">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="auth-link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;