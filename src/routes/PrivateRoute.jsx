import React from "react";
import { Navigate } from "react-router"; // Asegúrate de que coincida con tu versión de router
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, muestra el componente hijo (ej. Profile)
  return children;
};

export default PrivateRoute;