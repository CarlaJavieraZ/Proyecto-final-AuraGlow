// src/components/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>No estás autenticado. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <h2>Perfil de {user.nombre}</h2>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Profile;
