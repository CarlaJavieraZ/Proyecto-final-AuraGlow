import React from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const productId = product.id ?? product.product_id;
  const productName = product.nombre ?? product.name ?? "Producto";
  const productDescription = product.descripcion ?? product.description ?? "";
  const productImage =
    product.imagen_url ?? product.image_url ?? product.image ?? "";
  const productPrice = Number(product.precio ?? product.price ?? 0);

  const wished = isInWishlist(productId);

  const handleWishlist = () => {
    if (wished) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 product-card mx-auto">
      <Link to={`/product/${productId}`}>
        <img
          src={productImage}
          className="card-img-top product-card-image"
          alt={productName}
          style={{ cursor: "pointer" }}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <Link
          to={`/product/${productId}`}
          className="text-decoration-none text-dark"
        >
          <h5 className="card-title product-card-title">{productName}</h5>
        </Link>

        <p className="card-text product-card-description">
          {productDescription}
        </p>

        <p className="product-card-price mb-3">
          {productPrice.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          })}
        </p>

        <div className="d-grid gap-2 mt-auto">
          <button
            className="btn product-cart-btn"
            onClick={() => addToCart(productId, 1)}
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