import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Compras de ejemplo por ahora
  const purchases = [
    {
      _id: "c1",
      name: "Set de Skincare Aura Glow",
      price: 35990,
      image: "/images/products/jabon.jpg",
      date: "12-03-2026",
    },
    {
      _id: "c2",
      name: "Serum Hidratante",
      price: 18990,
      image: "/images/products/jabon.jpg",
      date: "05-03-2026",
    },
  ];

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <p>No estás autenticado. Por favor, inicia sesión.</p>
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
                    {user.nombre?.charAt(0)}
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
              <h2 className="profile-title mb-4">Mi Perfil</h2>

              <div className="profile-user-info">
                <p><strong>Nombre:</strong> {user.nombre}</p>
                {user.email && <p><strong>Correo:</strong> {user.email}</p>}
                {user.username && <p><strong>Usuario:</strong> {user.username}</p>}
              </div>

              <button className="btn profile-logout-btn mt-2" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="profile-box mb-5">
          <h3 className="profile-title mb-4">Mis deseados</h3>

          {wishlist.length === 0 ? (
            <p className="profile-empty-text">
              Aún no tienes productos guardados en tu lista de deseados.
            </p>
          ) : (
            <div className="row g-4">
              {wishlist.map((item) => (
                <div className="col-md-6 col-lg-4" key={item._id}>
                  <div className="profile-wishlist-card h-100">
                    <img
                      src={item.image}
                      className="profile-wishlist-image"
                      alt={item.name}
                    />

                    <h5 className="profile-product-name mt-3">{item.name}</h5>

                    <p className="profile-product-price">
                      {Number(item.price).toLocaleString("es-CL", {
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
          <h3 className="profile-title mb-4">Mis compras</h3>

          {purchases.length === 0 ? (
            <p className="profile-empty-text">
              Aún no tienes compras registradas.
            </p>
          ) : (
            <div className="row g-4">
              {purchases.map((item) => (
                <div className="col-md-6 col-lg-4" key={item._id}>
                  <div className="profile-purchase-card h-100">
                    <img
                      src={item.image}
                      className="profile-purchase-image"
                      alt={item.name}
                    />

                    <h5 className="profile-product-name mt-3">{item.name}</h5>

                    <p className="profile-product-price">
                      {Number(item.price).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </p>

                    <p className="profile-purchase-date">
                      Compra realizada: {item.date}
                    </p>

                    <button className="btn profile-secondary-btn">
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