import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const API_URL =
  process.env.REACT_APP_API_URL?.replace(/\/api$/, "") || "https://proyecto-final-auraglow.onrender.com";

const ProductDetail = () => {
  const { id } = useParams();
  const productId = id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Producto no encontrado");
          setProduct(null);
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const wishlisted = isInWishlist(productId);

  const handleAddToCart = async () => {
    await addToCart(productId, quantity);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(productId);
  };

  if (loading) {
    return <p className="text-center py-5">Cargando producto...</p>;
  }

  if (error || !product) {
    return (
      <p className="text-center py-5">
        {error || "Producto no encontrado"}
      </p>
    );
  }

  return (
    <div className="container py-5">
      <div className="row align-items-start g-4">
        <div className="col-md-6">
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="img-fluid rounded shadow-sm w-100"
          />
        </div>

        <div className="col-md-6">
          <p className="text-muted mb-2">{product.categoria}</p>
          <h2 className="mb-3">{product.nombre}</h2>
          <h4 className="mb-3">
            ${Number(product.precio || 0).toLocaleString("es-CL")}
          </h4>
          <p className="mb-4">{product.descripcion}</p>
          <p className="mb-3">
            <strong>Stock:</strong> {product.stock}
          </p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <label className="mb-0">
              <strong>Cantidad:</strong>
            </label>
            <input
              type="number"
              min="1"
              max={product.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="form-control"
              style={{ width: "100px" }}
            />
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn auth-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={handleToggleWishlist}
            >
              {wishlisted ? "Quitar de deseados" : "Agregar a deseados"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
