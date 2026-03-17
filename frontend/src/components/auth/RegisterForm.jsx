import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const response = register({ email, password, nombre });

    if (response.success) {
      console.log("Usuario creado con éxito. Ahora puedes iniciar sesión.");

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      navigate("/login");
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Registrarse</h2>

        {error && (
          <div className="alert alert-danger p-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;