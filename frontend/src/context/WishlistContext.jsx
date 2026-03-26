import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://proyecto-final-auraglow.onrender.com";

const normalizeWishlistResponse = (data) => {
  const rawItems = Array.isArray(data)
    ? data
    : data.items || data.wishlist || data.favorites || [];

  return rawItems.map((item) => {
    const product = item.product || item;

    return {
      id: product.id ?? item.product_id ?? item.id,
      product_id: product.id ?? item.product_id ?? item.id,
      nombre: product.nombre ?? product.name ?? "Producto",
      precio: Number(product.precio ?? product.price ?? 0),
      imagen_url:
        product.imagen_url ??
        product.image_url ??
        product.image ??
        "",
      descripcion: product.descripcion ?? product.description ?? "",
      categoria: product.categoria ?? product.category ?? "",
    };
  });
};

const resolveProductId = (value) => {
  if (value === null || value === undefined) return null;

  if (typeof value === "object") {
    const nestedId = value.product_id ?? value.id ?? null;
    return nestedId !== null && nestedId !== undefined ? String(nestedId) : null;
  }

  return String(value);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const response = await fetch(`${API_URL}/api/favorites${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });

      const contentType = response.headers.get("content-type") || "";
      let payload = null;

      if (contentType.includes("application/json")) {
        payload = await response.json().catch(() => null);
      } else {
        payload = await response.text().catch(() => null);
      }

      if (!response.ok) {
        throw new Error(
          payload?.message ||
          payload?.error ||
          payload?.detail ||
          payload ||
          `Error HTTP ${response.status}`
        );
      }

      return payload;
    },
    [token]
  );

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const data = await authFetch("");
      setWishlist(normalizeWishlistResponse(data));
    } catch (error) {
      console.error("Error al obtener wishlist:", error.message);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [authFetch, token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productValue) => {
    const resolvedId = resolveProductId(productValue);

    if (!resolvedId) {
      alert("No se encontró el id del producto");
      return;
    }

    if (!token) {
      alert("Debes iniciar sesión para agregar productos a favoritos");
      return;
    }

    try {
      await authFetch("", {
        method: "POST",
        body: JSON.stringify({
          product_id: resolvedId,
        }),
      });

      await fetchWishlist();
    } catch (error) {
      alert(error.message || "Error al agregar a favoritos");
    }
  };

  const removeFromWishlist = async (productValue) => {
    const resolvedId = resolveProductId(productValue);

    if (!resolvedId) {
      alert("No se encontró el id del producto para eliminar favoritos");
      return;
    }

    if (!token) {
      alert("Debes iniciar sesión para modificar favoritos");
      return;
    }

    try {
      await authFetch(`/${resolvedId}`, {
        method: "DELETE",
      });

      await fetchWishlist();
    } catch (error) {
      alert(error.message || "Error al eliminar de favoritos");
    }
  };

  const isInWishlist = useCallback(
    (productValue) => {
      const resolvedId = resolveProductId(productValue);
      if (!resolvedId) return false;

      return wishlist.some(
        (item) => String(item.product_id ?? item.id) === resolvedId
      );
    },
    [wishlist]
  );

  const toggleWishlist = async (productValue) => {
    const resolvedId = resolveProductId(productValue);

    if (!resolvedId) {
      alert("No se encontró el id del producto para favoritos");
      return;
    }

    if (!token) {
      alert("Debes iniciar sesión para agregar productos a favoritos");
      return;
    }

    if (isInWishlist(resolvedId)) {
      await removeFromWishlist(resolvedId);
    } else {
      await addToWishlist(resolvedId);
    }
  };

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);