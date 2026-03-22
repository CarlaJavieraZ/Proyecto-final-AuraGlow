import React from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const wished = isInWishlist(product.id);

  const handleWishlist = () => {
    if (wished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 product-card mx-auto">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imagen_url}
          className="card-img-top product-card-image"
          alt={product.nombre}
          style={{ cursor: "pointer" }}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <Link
          to={`/product/${product.id}`}
          className="text-decoration-none text-dark"
        >
          <h5 className="card-title product-card-title">{product.nombre}</h5>
        </Link>

        <p className="card-text product-card-description">
          {product.descripcion}
        </p>

        <p className="product-card-price mb-3">
          {product.price.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          })}
        </p>

        <div className="d-grid gap-2 mt-auto">
          <button
            className="btn product-cart-btn"
            onClick={() => addToCart(product.id || product.product_id, 1)}
          >
            Agregar al carrito
          </button>

          <button
            className={
              wished
                ? "product-wishlist-btn-active"
                : "product-wishlist-btn"
            }
            onClick={handleWishlist}
          >
            {wished ? "♥ Quitar de deseados" : "♡ Agregar a deseados"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;