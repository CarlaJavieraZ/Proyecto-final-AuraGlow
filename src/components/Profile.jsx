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

          <h2 className="profile-title mb-4">Perfil</h2>

          <div className="profile-avatar-section">

            {profileImage ? (
              <img
                src={profileImage}
                alt="Perfil"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {user.nombre.charAt(0)}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control mt-3"
            />

          </div>

          <div className="profile-user-info mt-3">
            <p>
              <strong>Nombre:</strong> {user.nombre}
            </p>
          </div>

          <button className="btn profile-logout-btn" onClick={logout}>
            Cerrar sesión
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;