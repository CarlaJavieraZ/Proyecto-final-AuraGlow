import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/auth/LoginForm";
import Register from "../components/auth/RegisterForm";
import Profile from "../components/Profile";
import PrivateRoute from "./PrivateRoute"; // Ruta privada
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Cart from "../components/ui/Cart";
import Wishlist from "../components/ui/Wishlist";


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
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
