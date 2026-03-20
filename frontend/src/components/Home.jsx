import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductList from "./products/ProductList";
import Carousel from "./ui/Carousel";
import FeaturedSections from "./layout/FeaturedSections";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get("category");
  const selectedCategory = categoryParam || "Todas";
  const isFiltering = categoryParam !== null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();

        const mappedProducts = data.map((product) => ({
          ...product,
          category: product.categoria,
          image: product.imagen_url,
          price: Number(product.precio),
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "Todas"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <div className="container">

        {!isFiltering && (
          <>
            <Carousel />
            <hr className="my-5" />
            <FeaturedSections />
            <hr className="my-5" />
          </>
        )}

        {isFiltering && (
          <div className="catalog-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="catalog-title">{selectedCategory}</h3>
              <p className="catalog-subtitle">
                Explora los productos disponibles en esta categoría.
              </p>
            </div>

            <button
              className="btn cart-clear-btn"
              onClick={() => navigate("/")}
            >
              ← Ver todo
            </button>
          </div>
        )}

        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
};

export default Home;