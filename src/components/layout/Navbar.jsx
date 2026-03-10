import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        Aura Glow
      </Link>

      <div className="navbar-nav ms-auto align-items-center">
        <Link className="nav-link" to="/">
          Inicio
        </Link>

        {user ? (
          <>
            <Link className="nav-link" to="/profile">
              Mi Perfil
            </Link>

            <span className="navbar-text mx-2 text-info">
              Hola, {user.nombre}
            </span>

            <button
              className="btn btn-outline-danger btn-sm me-3"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">
              Iniciar Sesión
            </Link>
            <Link className="nav-link" to="/register">
              Registrarse
            </Link>
          </>
        )}

        <Link to="/cart" className="nav-link position-relative ms-2">
          <FaShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;