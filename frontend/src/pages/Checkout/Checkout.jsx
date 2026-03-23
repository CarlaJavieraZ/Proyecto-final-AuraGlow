import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
    const { cartItems = [], total = 0, clearCart } = useCart();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const handleConfirmPurchase = async () => {
        try {
            setProcessing(true);

            const order = {
                id: `AG-${Date.now()}`,
                fecha: new Date().toLocaleString("es-CL"),
                estado: "Pagado",
                metodoPago: "Tarjeta terminada en 4242",
                items: cartItems,
                total,
            };

            const existingOrders = JSON.parse(localStorage.getItem("aura_orders") || "[]");

            localStorage.setItem("aura_orders", JSON.stringify([order, ...existingOrders]));
            localStorage.setItem("aura_last_order", JSON.stringify(order));

            await clearCart();

            navigate("/compra-exitosa", {
                state: { order },
            });
        } catch (error) {
            console.error("Error al simular compra:", error);
            alert("No se pudo completar la compra");
        } finally {
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h2>Checkout</h2>
                <p>Tu carrito está vacío.</p>
                <Link to="/cart" className="btn btn-outline-secondary">
                    Volver al carrito
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="p-4 border rounded bg-white">
                        <h2 className="mb-4">Detalle de compra</h2>

                        {cartItems.map((item) => (
                            <div
                                key={item.product_id ?? item.id}
                                className="d-flex align-items-center justify-content-between border-bottom py-3"
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={item.imagen_url}
                                        alt={item.nombre}
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "cover",
                                            borderRadius: "12px",
                                        }}
                                    />
                                    <div>
                                        <h6 className="mb-1">{item.nombre}</h6>
                                        <small>Cantidad: {item.quantity}</small>
                                    </div>
                                </div>

                                <strong>
                                    {(Number(item.subtotal ?? item.precio * item.quantity) || 0).toLocaleString(
                                        "es-CL",
                                        {
                                            style: "currency",
                                            currency: "CLP",
                                        }
                                    )}
                                </strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="p-4 border rounded bg-white">
                        <h4 className="mb-3">Resumen</h4>

                        <div className="d-flex justify-content-between mb-2">
                            <span>Productos</span>
                            <span>{cartItems.length}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-3">
                            <span>Total</span>
                            <strong>
                                {Number(total).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                })}
                            </strong>
                        </div>

                        <button
                            className="btn w-100"
                            style={{ backgroundColor: "#e8a8c0", border: "none" }}
                            onClick={handleConfirmPurchase}
                            disabled={processing}
                        >
                            {processing ? "Procesando..." : "Confirmar compra"}
                        </button>

                        <Link to="/cart" className="btn btn-link w-100 mt-2">
                            Volver al carrito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;