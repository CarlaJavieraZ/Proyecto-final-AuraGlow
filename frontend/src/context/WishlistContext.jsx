import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "https://proyecto-final-auraglow.onrender.com";

  const [wishlist, setWishlist] = useState([]);

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
          `Error HTTP ${response.status}`
        );
      }

      return payload;
    },
    [token, API_URL]
  );

  const loadWishlist = useCallback(async () => {
    if (!token) return setWishlist([]);

    try {
      const data = await authFetch("");
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      setWishlist([]);
    }
  }, [token, authFetch]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const addToWishlist = async (productId) => {
    try {
      await authFetch("", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      await loadWishlist();
    } catch (error) {
      alert(error.message);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await authFetch(`/${productId}`, {
        method: "DELETE",
      });

      await loadWishlist();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);