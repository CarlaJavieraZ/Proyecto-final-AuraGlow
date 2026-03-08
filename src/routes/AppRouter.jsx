import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "../components/Home";
import Login from "../components/auth/LoginForm";
import Register from "../components/auth/RegisterForm";
import Profile from "../components/Profile";
import PrivateRoute from "./PrivateRoute"; // Ruta privada
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default AppRouter;
