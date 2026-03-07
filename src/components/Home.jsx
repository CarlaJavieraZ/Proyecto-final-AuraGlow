// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import ProductList from "./products/ProductList";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("https://api.example.com/products");
      setProducts(response.data);
    };

    fetchProducts();
  }, []); // La dependencia vacía asegura que solo se ejecute una vez

  return (
    <div>
      <h1>Bienvenido a Aura Glow</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
