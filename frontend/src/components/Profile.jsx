import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [profileImage, setProfileImage] = useState(null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    const savedImage = localStorage.getItem(`profileImage_${user.email}`);
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const savedPurchases = localStorage.getItem("aura_orders");
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    } else {
      setPurchases([]);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem(`profileImage_${user.email}`, reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container py-5">
          <div className="profile-box text-center">
            <h2 className="profile-title mb-3">Mi perfil</h2>
            <p className="profile-empty-text mb-3">
              No estás autenticado. Por favor, inicia sesión.
            </p>
            <Link to="/login" className="btn profile-cart-btn">
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="profile-box mb-5">
          <div className="row align-items-center g-4">
            <div className="col-md-4 text-center">
              <div className="profile-avatar-section">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user.nombre?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control mt-3"
                />
              </div>
            </div>

            <div className="col-md-8">
              <h2 className="profile-title mb-4">Mi perfil</h2>

              <div className="profile-user-info">
                <p>
                  <strong>Nombre:</strong> {user.nombre || "Sin nombre"}
                </p>

                {user.email && (
                  <p>
                    <strong>Correo:</strong> {user.email}
                  </p>
                )}

                {user.username && (
                  <p>
                    <strong>Usuario:</strong> {user.username}
                  </p>
                )}

                <p>
                  <strong>Rol:</strong>{" "}
                  {user.role === "admin" ? "Administrador" : "Cliente"}
                </p>
              </div>

              <button className="btn profile-logout-btn mt-2" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="profile-box mb-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <h3 className="profile-title mb-0">Mis deseados</h3>
            <span className="profile-section-count">
              {wishlist.length} producto{wishlist.length !== 1 ? "s" : ""}
            </span>
          </div>

          {wishlist.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-state-icon">♡</div>
              <h4 className="empty-state-title">No tienes deseados guardados</h4>
              <p className="empty-state-text">
                Aquí aparecerán los productos que marques como favoritos.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {wishlist.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <div className="profile-wishlist-card h-100">
                    <img
                      src={item.imagen_url}
                      className="profile-wishlist-image"
                      alt={item.nombre}
                      onError={handleImageError}
                    />

                    <h5 className="profile-product-name mt-3">{item.nombre}</h5>

                    {item.description && (
                      <p className="profile-product-description mb-2">
                        {item.descripcion}
                      </p>
                    )}

                    <p className="profile-product-price">
                      {Number(item.precio).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </p>

                    <div className="d-grid gap-2">
                      <button
                        className="btn profile-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        Agregar al carrito
                      </button>

                      <button
                        className="btn profile-remove-btn"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        Quitar de deseados
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-box">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <h3 className="profile-title mb-0">Mis compras</h3>
            <span className="profile-section-count">
              {purchases.length} compra{purchases.length !== 1 ? "s" : ""}
            </span>
          </div>

          {purchases.length === 0 ? (
            <div>
              <div className="empty-state-box mb-3">
                <div className="empty-state-icon">🧾</div>
                <h4 className="empty-state-title">Aún no tienes compras</h4>
                <p className="empty-state-text">
                  Cuando completes una compra, aparecerá aquí tu historial.
                </p>
              </div>
              <Link to="/" className="btn profile-cart-btn">
                Ir a comprar
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {purchases.map((order) => (
                <div className="col-md-6 col-lg-4" key={order.id}>
                  <div className="profile-purchase-card h-100">
                    <div className="profile-purchase-image profile-image-fallback">
                      Aura Glow
                    </div>

                    <h5 className="profile-product-name mt-3">
                      Pedido {order.id}
                    </h5>

                    <p className="profile-product-price">
                      {Number(order.total || 0).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </p>

                    <p className="profile-purchase-date">
                      Compra realizada: {order.fecha}
                    </p>

                    <p className="mb-2">
                      <strong>Estado:</strong> {order.estado}
                    </p>

                    <p className="mb-3">
                      <strong>Productos:</strong> {order.items?.length || 0}
                    </p>

                    <button
                      className="btn profile-secondary-btn"
                      onClick={() =>
                        alert(
                          (order.items || [])
                            .map(
                              (item) =>
                                `${item.nombre} x${item.quantity} - ${Number(
                                  item.subtotal ?? item.precio * item.quantity ?? 0
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}`
                            )
                            .join("\n")
                        )
                      }
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;