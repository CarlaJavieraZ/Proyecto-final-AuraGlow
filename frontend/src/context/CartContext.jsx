import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "https://proyecto-final-auraglow.onrender.com";

  const [cart, setCart] = useState([]);

  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const response = await fetch(`${API_URL}/api/cart${endpoint}`, {
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

        throw new Error(
          payload?.message ||
          payload?.error ||
          `Error HTTP ${response.status}`
        );
      }

      return payload;
    },
    [token, API_URL]
  );

  const loadCart = useCallback(async () => {
    if (!token) return setCart([]);

    try {
      const data = await authFetch("");
      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setCart([]);
    }
  }, [token, authFetch]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await authFetch("", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      await loadCart();
    } catch (error) {
      alert(error.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await authFetch(`/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });

      await loadCart();
    } catch (error) {
      alert(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await authFetch(`/${productId}`, {
        method: "DELETE",
      });

      await loadCart();
    } catch (error) {
      alert(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await authFetch("", {
        method: "DELETE",
      });

      setCart([]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
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