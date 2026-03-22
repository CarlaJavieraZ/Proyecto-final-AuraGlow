import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const storedOrder = localStorage.getItem("aura_last_order");
    const order = location.state?.order || (storedOrder ? JSON.parse(storedOrder) : null);

    if (!order) {
        return (
            <div className="container py-5 text-center">
                <h2>No se encontró la compra</h2>
                <Link to="/" className="btn btn-outline-secondary mt-3">
                    Ir al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="mx-auto p-4 border rounded bg-white" style={{ maxWidth: "700px" }}>
                <div className="text-center mb-4">
                    <h2>¡Compra realizada con éxito!</h2>
                    <p className="mb-1">Tu pedido fue procesado correctamente.</p>
                    <small>N° pedido: {order.id}</small>
                    <br />
                    <small>Fecha: {order.fecha}</small>
                </div>

                <div className="mb-4">
                    <h5 className="mb-3">Detalle de la compra</h5>

                    {order.items.map((item) => (
                        <div
                            key={item.product_id ?? item.id}
                            className="d-flex justify-content-between border-bottom py-2"
                        >
                            <div>
                                <strong>{item.nombre}</strong>
                                <div>
                                    <small>Cantidad: {item.quantity}</small>
                                </div>
                            </div>

                            <span>
                                {(Number(item.subtotal ?? item.precio * item.quantity) || 0).toLocaleString(
                                    "es-CL",
                                    {
                                        style: "currency",
                                        currency: "CLP",
                                    }
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <span>Método de pago</span>
                    <strong>{order.metodoPago}</strong>
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <span>Estado</span>
                    <strong>{order.estado}</strong>
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <span>Total pagado</span>
                    <strong>
                        {Number(order.total).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                        })}
                    </strong>
                </div>

                <div className="text-center">
                    <Link to="/" className="btn" style={{ backgroundColor: "#e8a8c0", border: "none" }}>
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;