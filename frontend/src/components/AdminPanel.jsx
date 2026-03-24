import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://proyecto-final-auraglow.onrender.com";


const AdminPanel = () => {
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        nombre: "",
        precio: 0,
        descripcion: "",
        imagen_url: "",
        categoria: "",
        stock: "",
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProducts();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            precio: 0,
            descripcion: "",
            imagen_url: "",
            categoria: "",
            stock: "",
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();

        if (
            !formData.nombre ||
            !formData.precio ||
            !formData.descripcion ||
            !formData.imagen_url ||
            !formData.categoria ||
            formData.stock === ""
        ) {
            alert("Completa todos los campos.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const payload = {
                nombre: formData.nombre,
                precio: Number(formData.precio),
                descripcion: formData.descripcion,
                imagen_url: formData.imagen_url,
                categoria: formData.categoria,
                stock: Number(formData.stock),
            };

            const url = isEditing
                ? `${API_URL}/api/products/${editingId}`
                : `${API_URL}/api/products`;

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Ocurrió un error");
                return;
            }

            const productsRes = await fetch(`${API_URL}/api/products`);
            const productsData = await productsRes.json();
            setProducts(productsData);

            resetForm();
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Error al guardar producto");
        }
    };

    const handleEdit = (product) => {
        setFormData({
            nombre: product.nombre || "",
            precio: product.precio || 0,
            descripcion: product.descripcion || "",
            imagen_url: product.imagen_url || "",
            categoria: product.categoria || "",
            stock: product.stock || "",
        });
        setIsEditing(true);
        setEditingId(product.id);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "¿Seguro que quieres eliminar este producto?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "No se pudo eliminar");
                return;
            }

            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar producto");
        }
    };

    return (
        <div className="admin-page">
            <div className="container py-5">
                <div className="admin-box mb-4">
                    <h2 className="admin-title">Panel Administrativo</h2>
                    <p className="admin-subtitle mb-0">
                        Bienvenida, {user?.nombre}. Aquí puedes gestionar productos de Aura
                        Glow.
                    </p>
                </div>

                <div className="admin-box mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h3 className="admin-section-title mb-0">
                            {isEditing ? "Editar producto" : "Agregar producto"}
                        </h3>
                    </div>

                    <form onSubmit={handleAddOrUpdate}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="auth-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control auth-input"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre del producto"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    className="form-control auth-input"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    placeholder="Precio"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    className="form-control auth-input"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="Stock disponible"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Imagen</label>
                                <input
                                    type="text"
                                    name="imagen_url"
                                    className="form-control auth-input"
                                    value={formData.imagen_url}
                                    onChange={handleChange}
                                    placeholder="/images/products/nuevo.png"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Categoría</label>
                                <input
                                    type="text"
                                    name="categoria"
                                    className="form-control auth-input"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    placeholder="Cremas, Serums, Tonicos..."
                                />
                            </div>

                            <div className="col-12">
                                <label className="auth-label">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    className="form-control auth-input"
                                    rows="3"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción del producto"
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap mt-4">
                            <button type="submit" className="admin-add-btn">
                                {isEditing ? "Guardar cambios" : "+ Agregar producto"}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    className="admin-edit-btn"
                                    onClick={resetForm}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-box">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h3 className="admin-section-title mb-0">Gestión de productos</h3>
                        <span className="section-chip">
                            {products.length} producto{products.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table admin-table align-middle">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descripción</th>
                                    <th>Categoría</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                src={product.imagen_url}
                                                alt={product.nombre}
                                                className="admin-product-image"
                                            />
                                        </td>
                                        <td>{product.nombre}</td>
                                        <td>
                                            {Number(product.precio).toLocaleString("es-CL", {
                                                style: "currency",
                                                currency: "CLP",
                                            })}
                                        </td>
                                        <td>{product.descripcion}</td>
                                        <td>{product.categoria}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button
                                                    type="button"
                                                    className="admin-edit-btn"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-delete-btn"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
