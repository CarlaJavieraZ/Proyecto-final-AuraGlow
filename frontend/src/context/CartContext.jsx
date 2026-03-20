import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  
  const removeFromCart = (_id) => {
    setCart(
      cart
        .map((item) => {
          if (item._id === _id) {
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  
  const deleteFromCart = (_id) => {
    setCart(cart.filter((item) => item._id !== _id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);