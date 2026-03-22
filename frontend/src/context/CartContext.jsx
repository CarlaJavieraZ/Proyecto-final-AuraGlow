import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getErrorMessage = (payload, status) => {
  if (!payload) return `Error HTTP ${status}`;

  if (typeof payload === "string") return payload;

  return (
    payload.message ||
    payload.error ||
    payload.detail ||
    payload.details ||
    JSON.stringify(payload)
  );
};

const normalizeCartResponse = (data) => {
  const rawItems = Array.isArray(data)
    ? data
    : data.items || data.cartItems || data.cart || [];

  const items = rawItems.map((item) => {
    const quantity = Number(item.quantity ?? 1);
    const precio = Number(item.precio ?? 0);
    const subtotal = Number(item.subtotal ?? precio * quantity);

    return {
      id: item.id ?? item.cart_item_id ?? item.product_id,
      product_id: item.product_id ?? item.productId ?? item.id,
      nombre: item.nombre ?? "Producto",
      precio,
      subtotal,
      imagen_url: item.imagen_url ?? item.image ?? "",
      quantity,
    };
  });

  const totalFromBackend = Number(
    Array.isArray(data) ? 0 : data.total ?? data.cartTotal ?? 0
  );

  const total =
    totalFromBackend ||
    items.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);

  return { items, total };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
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
        console.error("Error backend carrito:", {
          status: response.status,
          payload,
        });

        throw new Error(getErrorMessage(payload, response.status));
      }

      return payload;
    },
    [token]
  );

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      setTotal(0);
      return;
    }

    setLoading(true);

    try {
      const data = await authFetch("/cart");
      const normalized = normalizeCartResponse(data);

      setCartItems(normalized.items);
      setTotal(normalized.total);
    } catch (error) {
      console.error("Error al obtener carrito:", error.message);
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [authFetch, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!token) {
        throw new Error("Debes iniciar sesión para agregar productos al carrito");
      }

      if (!productId) {
        throw new Error("No se encontró el ID del producto");
      }

      const numericProductId = Number(productId);
      const numericQuantity = Number(quantity) || 1;

      console.log("Enviando al carrito:", {
        productId: numericProductId,
        quantity: numericQuantity,
        tokenExists: !!token,
      });

      await authFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          product_id: numericProductId,
          productId: numericProductId,
          quantity: numericQuantity,
        }),
      });

      await fetchCart();
    } catch (error) {
      console.error("Error al agregar al carrito:", error.message);
      throw error;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const numericProductId = Number(productId);
      const numericQuantity = Number(newQuantity);

      if (numericQuantity <= 0) {
        await removeFromCart(numericProductId);
        return;
      }

      await authFetch(`/cart/${numericProductId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: numericQuantity,
        }),
      });

      await fetchCart();
    } catch (error) {
      console.error("Error al actualizar cantidad:", error.message);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const numericProductId = Number(productId);

      await authFetch(`/cart/${numericProductId}`, {
        method: "DELETE",
      });

      await fetchCart();
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await authFetch("/cart", {
        method: "DELETE",
      });

      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error al vaciar carrito:", error.message);
      throw error;
    }
  };

  const itemCount = useMemo(() => {
    return (cartItems || []).reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        itemCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);