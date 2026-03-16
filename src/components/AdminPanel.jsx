import React from "react";
import { useAuth } from "../context/AuthContext";
import productsData from "../assets/mockdata/products.json";

const AdminPanel = () => {
    const { user } = useAuth();

    return (
        <div className="admin-page">
            <div className="container py-5">
                <div className="admin-box mb-4">
                    <h2 className="admin-title">Panel Administrativo</h2>
                    <p className="admin-subtitle mb-0">
                        Bienvenida, {user?.nombre}. Aquí puedes gestionar productos de Aura Glow.
                    </p>
                </div>

                <div className="admin-box">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h3 className="admin-section-title mb-0">Gestión de productos</h3>
                        <button className="btn admin-add-btn">
                            + Agregar producto
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table admin-table align-middle">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsData.map((product) => (
                                    <tr key={product._id}>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="admin-product-image"
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>
                                            {Number(product.price).toLocaleString("es-CL", {
                                                style: "currency",
                                                currency: "CLP",
                                            })}
                                        </td>
                                        <td>{product.description}</td>
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button className="btn admin-edit-btn">Editar</button>
                                                <button className="btn admin-delete-btn">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="admin-note mt-3 mb-0">
                        Por ahora este panel es visual y funcional a nivel frontend. Después puedes conectarlo al backend para crear, editar y eliminar productos reales.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;