import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import productsData from "../assets/mockdata/products.json";

const AdminPanel = () => {
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
    });

    useEffect(() => {
        const savedProducts = localStorage.getItem("aura_products");

        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            setProducts(productsData);
            localStorage.setItem("aura_products", JSON.stringify(productsData));
        }
    }, []);

    const saveProducts = (updatedProducts) => {
        setProducts(updatedProducts);
        localStorage.setItem("aura_products", JSON.stringify(updatedProducts));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            description: "",
            image: "",
            category: "",
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleAddOrUpdate = (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.price ||
            !formData.description ||
            !formData.image ||
            !formData.category
        ) {
            alert("Completa todos los campos.");
            return;
        }

        if (isEditing) {
            const updatedProducts = products.map((product) =>
                product._id === editingId
                    ? {
                        ...product,
                        ...formData,
                        price: Number(formData.price),
                    }
                    : product
            );

            saveProducts(updatedProducts);
            resetForm();
            return;
        }

        const newProduct = {
            _id: Date.now().toString(),
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            image: formData.image,
            category: formData.category,
            url: "/",
        };

        const updatedProducts = [...products, newProduct];
        saveProducts(updatedProducts);
        resetForm();
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            image: product.image || "",
            category: product.category || "",
        });
        setIsEditing(true);
        setEditingId(product._id);
    };

    const handleDelete = (_id) => {
        const confirmDelete = window.confirm(
            "¿Seguro que quieres eliminar este producto?"
        );

        if (!confirmDelete) return;

        const updatedProducts = products.filter((product) => product._id !== _id);
        saveProducts(updatedProducts);
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
                                    name="name"
                                    className="form-control auth-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre del producto"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Precio</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-control auth-input"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Precio"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Imagen</label>
                                <input
                                    type="text"
                                    name="image"
                                    className="form-control auth-input"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="/images/products/nuevo.png"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="auth-label">Categoría</label>
                                <input
                                    type="text"
                                    name="category"
                                    className="form-control auth-input"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="Cremas, Serums, Tonicos..."
                                />
                            </div>

                            <div className="col-12">
                                <label className="auth-label">Descripción</label>
                                <textarea
                                    name="description"
                                    className="form-control auth-input"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descripción del producto"
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap mt-4">
                            <button type="submit" className="btn admin-add-btn">
                                {isEditing ? "Guardar cambios" : "+ Agregar producto"}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn admin-edit-btn"
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
                                        <td>{product.category}</td>
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button
                                                    className="btn admin-edit-btn"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn admin-delete-btn"
                                                    onClick={() => handleDelete(product._id)}
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

                    <p className="admin-note mt-3 mb-0">
                        Los cambios se guardan en localStorage para simular una gestión real
                        de productos en frontend.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;