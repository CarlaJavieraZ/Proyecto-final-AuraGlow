import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        Aura Glow
      </Link>

      <div className="navbar-nav ms-auto align-items-center">

        {/* Inicio */}
        <Link className="nav-link" to="/">
          Inicio
        </Link>

        {/* Carrito */}
        <Link to="/cart" className="nav-link position-relative ms-2">
          <FaShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Wishlist */}
        <Link to="/wishlist" className="nav-link position-relative ms-2">
          <FaHeart size={20} />
          {totalWishlistItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalWishlistItems}
            </span>
          )}
        </Link>

        {user ? (
          <>
            {/* Perfil */}
            <Link className="nav-link ms-2" to="/profile">
              Perfil
            </Link>

            {/* Saludo */}
            <span className="navbar-text mx-2 navbar-user-name">
              Hola, {user.nombre}
            </span>

            {/* Cerrar sesión */}
            <button
              className="btn btn-outline-danger btn-sm ms-2"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link ms-2" to="/login">
              Iniciar Sesión
            </Link>
            <Link className="nav-link ms-2" to="/register">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;