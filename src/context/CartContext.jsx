import React, { createContext, useState, useEffect, useContext } from 'react';
import { shopifyService } from '../services/shopifyService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load cart & checkout from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopease_cart');
    const savedCheckout = localStorage.getItem('shopease_checkout');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCheckout) setCheckout(JSON.parse(savedCheckout));
  }, []);

  useEffect(() => {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
    localStorage.setItem('shopease_checkout', JSON.stringify(checkout));
  }, [cart, checkout]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      let updatedCart = [...cart];
      const index = cart.findIndex(item => item.id === product.id);
      if (index > -1) {
        updatedCart[index].quantity += quantity;
      } else {
        updatedCart.push({ ...product, quantity });
      }
      setCart(updatedCart);

      // Shopify checkout logic
      const lineItems = [{ variantId: product.variantId, quantity }];
      let updatedCheckout;
      if (!checkout) {
        updatedCheckout = await shopifyService.createCheckout(lineItems);
      } else {
        updatedCheckout = await shopifyService.addToCheckout(checkout.id, lineItems);
      }
      setCheckout(updatedCheckout);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCheckout(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const openShopifyCart = () => {
    if (checkout?.webUrl) {
      window.open(checkout.webUrl, '_blank');
    } else if (cart.length > 0) {
      window.open('https://headlessstore-2.myshopify.com/cart', '_blank');
    } else {
      alert('Your cart is empty!');
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      checkout,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loading,
      cartCount,
      cartTotal,
      openShopifyCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
