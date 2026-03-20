import React from "react";
import { useParams, Link } from "react-router-dom";
import productsData from "../../assets/mockdata/products.json";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const product = productsData.find((item) => item._id === id);

  if (!product) {
    return (
      <div className="container py-5 product-detail-page">
        <div className="product-detail-box text-center">
          <h2 className="product-detail-title">Producto no encontrado</h2>
          <Link to="/" className="btn product-detail-back-btn mt-3">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const wished = isInWishlist(product._id);

  const handleWishlist = () => {
    if (wished) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="container py-5 product-detail-page">
      <div className="product-detail-box">
        <div className="row align-items-center g-4">
          <div className="col-md-6 text-center">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid product-detail-image"
            />
          </div>

          <div className="col-md-6">
            <p className="product-detail-category mb-2">
              {product.category || "Skincare"}
            </p>

            <h2 className="product-detail-title mb-3">{product.name}</h2>

            <p className="product-detail-description">{product.description}</p>

            <p className="product-detail-price mt-4 mb-4">
              {product.price.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </p>

            <div className="d-grid gap-2 d-md-block">
              <button
                className="btn product-detail-cart-btn me-md-2 mb-2"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>

              <button
                className={
                  wished
                    ? "btn product-detail-wishlist-btn-active mb-2"
                    : "btn product-detail-wishlist-btn mb-2"
                }
                onClick={handleWishlist}
              >
                {wished ? "♥ Quitar de deseados" : "♡ Agregar a deseados"}
              </button>
            </div>

            <div className="mt-4">
              <Link to="/" className="btn product-detail-back-btn">
                ← Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;