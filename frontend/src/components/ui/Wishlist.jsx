import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist = [], removeFromWishlist } = useWishlist();
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

            <div className="empty-state-box">
              <div className="empty-state-icon">♡</div>
              <h4 className="empty-state-title">Tu lista está vacía</h4>
              <p className="empty-state-text mb-3">
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
          <div className="section-header">
            <div>
              <h2 className="wishlist-title mb-1">Mis deseados</h2>
              <p className="wishlist-subtitle mb-0">
                Tus favoritos guardados para después
              </p>
            </div>

            <span className="section-chip">
              {wishlist.length} producto{wishlist.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="row g-4">
            {wishlist.map((item) => {
              const productId = item.product_id || item.id;

              return (
                <div className="col-md-6 col-lg-4" key={productId}>
                  <div className="wishlist-item-card h-100">
                    <div className="text-center">
                      <img
                        src={item.imagen_url}
                        className="wishlist-item-image"
                        alt={item.nombre}
                      />
                    </div>

                    <div className="mt-3">
                      <h5 className="wishlist-item-name">{item.nombre}</h5>

                      {item.descripcion && (
                        <p className="wishlist-item-description">
                          {item.descripcion}
                        </p>
                      )}

                      <p className="wishlist-item-price mb-3">
                        ${Number(item.precio || 0).toLocaleString("es-CL")}
                      </p>

                      <div className="d-grid gap-2">
                        <button
                          className="btn wishlist-cart-btn"
                          onClick={() => addToCart(productId, 1)}
                        >
                          Agregar al carrito
                        </button>

                        <button
                          className="wishlist-remove-btn"
                          onClick={() => removeFromWishlist(productId)}
                        >
                          Eliminar de deseados
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;