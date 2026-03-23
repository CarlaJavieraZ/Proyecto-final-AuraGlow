import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount = 0 } = useCart();
  const { wishlist = [] } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalWishlistItems = wishlist.length;

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="/images/logonav.png"
          alt="Aura Glow"
          className="navbar-logo"
        />
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mainNavbar">
        <div className="navbar-nav ms-auto align-items-lg-center">
          <Link className="nav-link" to="/">
            Inicio
          </Link>

          <li className="nav-item dropdown list-unstyled">
            <button
              className="nav-link dropdown-toggle btn btn-link text-decoration-none"
              id="categoriesDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              type="button"
            >
              Categorías
            </button>
            <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
              <li>
                <Link className="dropdown-item" to="/?category=Todas">
                  ✨ Todas
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/?category=Jabones">
                  🧼 Jabones
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/?category=Tonicos">
                  💧 Tonicos
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/?category=Serums">
                  ✨ Serums
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/?category=Cremas">
                  🧴 Cremas
                </Link>
              </li>
            </ul>
          </li>

          <Link to="/cart" className="nav-link position-relative ms-2">
            <FaShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {itemCount}
              </span>
            )}
          </Link>

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
              <Link className="nav-link ms-2" to="/profile">
                Perfil
              </Link>

              {user?.role === "admin" && (
                <Link className="nav-link ms-2" to="/admin">
                  Admin
                </Link>
              )}

              <span className="navbar-text mx-2 navbar-user-name">
                Hola, {user.nombre}
              </span>

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
      </div>
    </nav>
  );
};

export default Navbar;