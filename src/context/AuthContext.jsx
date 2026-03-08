import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("aura_active_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedList = localStorage.getItem("aura_db_users");
    return savedList ? JSON.parse(savedList) : [];
  });

  const register = (newUser) => {
    const exists = registeredUsers.some(u => u.email === newUser.email);
    if (exists) {
      return { success: false, message: "El usuario ya existe" };
    }

    const updatedList = [...registeredUsers, newUser];
    setRegisteredUsers(updatedList);
    localStorage.setItem("aura_db_users", JSON.stringify(updatedList));
    return { success: true, message: "Registro exitoso" };
  };

  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("aura_active_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aura_active_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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