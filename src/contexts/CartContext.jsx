import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('tempCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('tempCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity, size, temp) => {
    const cartItem = {
      ...product,
      quantity: quantity,
      size: size,
      temp: temp,
      cartId: Date.now() + Math.random()
    };
    
    setCart(prevCart => [...prevCart, cartItem]);
  };

  const removeFromCart = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const updateCartItem = (cartId, updates) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.cartId === cartId ? { ...item, ...updates } : item
      )
    );
  };


  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('tempCart');
  };


  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };


  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};