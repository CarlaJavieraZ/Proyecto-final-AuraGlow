import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("aura_active_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.error || data.message || "Error al iniciar sesión",
        };
      }

      const receivedToken = data.token || data.accessToken || null;
      const receivedUserRaw = data.user || data.usuario || null;

      const normalizedUser = receivedUserRaw
        ? {
          ...receivedUserRaw,
          role: receivedUserRaw.role ?? receivedUserRaw.rol ?? "user",
        }
        : null;

      if (!receivedToken) {
        return {
          success: false,
          message: "El backend no devolvió token",
        };
      }

      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);

      if (normalizedUser) {
        setUser(normalizedUser);
        localStorage.setItem("aura_active_user", JSON.stringify(normalizedUser));
      }

      return {
        success: true,
        user: normalizedUser,
      };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "No se pudo conectar con el servidor",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("aura_active_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };