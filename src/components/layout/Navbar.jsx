import React from "react";
import { Link, useNavigate } from "react-router"; // Asegúrate de importar Link
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Aura Glow</Link>
      
      <div className="navbar-nav ms-auto">
        <Link className="nav-link" to="/">Inicio</Link>
        {}
        {user ? (
          <>
            <Link className="nav-link" to="/profile">Mi Perfil</Link>
            <span className="navbar-text mx-2 text-info">
              Hola, {user.nombre}
            </span>
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Iniciar Sesión</Link>
            <Link className="nav-link" to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;