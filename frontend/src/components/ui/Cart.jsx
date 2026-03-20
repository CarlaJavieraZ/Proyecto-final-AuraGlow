import React from "react";
import { useCart } from "../../context/CartContext";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
    const { cart, addToCart, removeFromCart, deleteFromCart, clearCart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container py-5">
                    <div className="cart-box text-center">
                        <h2 className="cart-title mb-3">Tu carrito está vacío</h2>
                        <p className="cart-subtitle mb-4">
                            Agrega tus productos favoritos y arma tu rutina Aura Glow ✨
                        </p>
                        <div className="empty-state-box mt-3">
                            <div className="empty-state-icon">🛒</div>
                            <h4 className="empty-state-title">Aún no tienes productos</h4>
                            <p className="empty-state-text">
                                Explora Aura Glow y agrega tus favoritos al carrito.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container py-5">
                <div className="cart-box">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h2 className="cart-title mb-1">Mi carrito</h2>
                            <p className="cart-subtitle mb-0">
                                Revisa tus productos antes de continuar
                            </p>
                        </div>

                        <button
                            className="btn cart-clear-btn"
                            onClick={() => {
                                if (window.confirm("¿Seguro que quieres vaciar el carrito?")) {
                                    clearCart();
                                }
                            }}
                        >
                            Vaciar carrito
                        </button>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            {cart.map((item) => (
                                <div key={item._id} className="cart-item-card mb-3">
                                    <div className="row align-items-center g-3">
                                        <div className="col-md-3 text-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                        </div>

                                        <div className="col-md-5">
                                            <h5 className="cart-item-name">{item.name}</h5>
                                            <p className="cart-item-price mb-1">
                                                ${item.price.toLocaleString("es-CL")}
                                            </p>
                                            <small className="cart-item-text">
                                                Producto de skincare Aura Glow
                                            </small>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="d-flex flex-column align-items-md-end align-items-start gap-2">
                                                <div className="cart-quantity-box">
                                                    <button
                                                        className="cart-qty-btn"
                                                        onClick={() => removeFromCart(item._id)}
                                                    >
                                                        −
                                                    </button>

                                                    <span className="cart-quantity-number">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        className="cart-qty-btn"
                                                        onClick={() => addToCart(item)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <p className="cart-item-subtotal mb-0">
                                                    Subtotal: $
                                                    {(item.price * item.quantity).toLocaleString("es-CL")}
                                                </p>

                                                <button
                                                    className="cart-remove-item-btn"
                                                    onClick={() => deleteFromCart(item._id)}
                                                >
                                                    <FaTrash /> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-lg-4">
                            <div className="cart-summary-card">
                                <h4 className="cart-summary-title mb-4">Resumen de compra</h4>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Productos</span>
                                    <span>
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Total</span>
                                    <strong>${total.toLocaleString("es-CL")}</strong>
                                </div>

                                <button className="btn cart-checkout-btn w-100 mb-2">
                                    Continuar compra
                                </button>

                                <p className="cart-summary-note mb-0">
                                    En Aura Glow cuidamos tu piel con una experiencia suave,
                                    delicada y pensada para ti.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;