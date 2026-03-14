import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container py-5">
          <div className="wishlist-box text-center">
            <h2 className="wishlist-title mb-3">Mis deseados</h2>
            <p className="wishlist-subtitle mb-4">
              Aún no has agregado productos a tu lista de deseados.
            </p>

            <div className="py-4">
              <div style={{ fontSize: "3rem" }}>♡</div>
              <p className="wishlist-empty-text">
                Guarda aquí tus productos favoritos de Aura Glow.
              </p>

              <Link to="/" className="btn wishlist-shop-btn mt-2">
                Ir a comprar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container py-5">
        <div className="wishlist-box">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <h2 className="wishlist-title mb-1">Mis deseados</h2>
              <p className="wishlist-subtitle mb-0">
                Tus favoritos guardados para después
              </p>
            </div>
          </div>

          <div className="row g-4">
            {wishlist.map((item) => (
              <div className="col-md-6 col-lg-4" key={item._id}>
                <div className="wishlist-item-card h-100">
                  <div className="text-center">
                    <img
                      src={item.image}
                      className="wishlist-item-image"
                      alt={item.name}
                    />
                  </div>

                  <div className="mt-3">
                    <h5 className="wishlist-item-name">{item.name}</h5>
                    <p className="wishlist-item-description">
                      {item.description}
                    </p>
                    <p className="wishlist-item-price mb-3">
                      ${Number(item.price).toLocaleString("es-CL")}
                    </p>

                    <div className="d-grid gap-2">
                      <button
                        className="btn wishlist-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        Agregar al carrito
                      </button>

                      <button
                        className="btn wishlist-remove-btn"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        Eliminar de deseados
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;