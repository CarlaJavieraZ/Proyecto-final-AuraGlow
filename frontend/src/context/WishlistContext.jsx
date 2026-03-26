import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "https://proyecto-final-auraglow.onrender.com/api/favorites";

const normalizeWishlistResponse = (data) => {
  const rawItems = Array.isArray(data)
    ? data
    : data.items || data.wishlist || data.favorites || [];

  return rawItems.map((item) => ({
    id: item.product_id ?? item.id,
    product_id: item.product_id ?? item.id,
    nombre: item.nombre ?? item.name ?? "Producto",
    precio: Number(item.precio ?? item.price ?? 0),
    imagen_url: item.imagen_url ?? item.image_url ?? item.image ?? "",
    descripcion: item.descripcion ?? item.description ?? "",
    categoria: item.categoria ?? item.category ?? "",
  }));
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

  const token = localStorage.getItem("token");

  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const response = await fetch(`${API_URL}/api${endpoint}`, {
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
      const data = await authFetch("/favorites");
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
      await authFetch("/favorites", {
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
      await authFetch(`/favorites/${resolvedId}`, {
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
