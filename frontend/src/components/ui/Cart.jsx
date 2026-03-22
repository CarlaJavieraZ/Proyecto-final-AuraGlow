import React from "react";
import { useCart } from "../../context/CartContext";
const formatPrice = (value) => {
  return Number(value || 0).toLocaleString("es-CL");
};

const Cart = () => {
  const { cartItems, total, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="mb-4">Mi carrito</h2>
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container py-5">
        <h2 className="mb-4">Mi carrito</h2>
        <div className="alert alert-light border rounded-4 shadow-sm">
          Tu carrito está vacío.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Mi carrito</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="card mb-3 border-0 shadow-sm rounded-4"
            >
              <div className="row g-0 align-items-center">
                <div className="col-md-3 p-3 text-center">
                  <img
                    src={item.imagen_url || "https://via.placeholder.com/300x300?text=Producto"}
                    alt={item.nombre}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: "120px", objectFit: "cover" }}
                  />
                </div>

                <div className="col-md-9">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div>
                        <h5 className="mb-1">{item.nombre}</h5>
                        <p className="text-muted mb-2">
                          Precio unitario: ${formatPrice(item.precio)}
                        </p>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-3">
                      <div className="d-flex align-items-center border rounded-pill px-2 py-1">
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                        >
                          -
                        </button>

                        <span className="mx-3 fw-semibold">{item.quantity}</span>

                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="fw-bold">
                        Subtotal: ${formatPrice(item.subtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h4 className="mb-4">Resumen</h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Productos</span>
                <span>
                  {cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0)}
                </span>
              </div>

              <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
              </div>

              <button className="btn btn-dark w-100 mt-4 rounded-pill">
                Ir a pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;