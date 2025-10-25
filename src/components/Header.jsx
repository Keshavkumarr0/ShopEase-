import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaHome, FaBox } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { cartCount, cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <FaBox size={28} />
            <span>ShopEase</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="header-nav desktop-nav">
            <Link to="/">
              <FaHome size={20} />
              <span>Home</span>
            </Link>
            <Link to="/products">
              <FaBox size={20} />
              <span>Products</span>
            </Link>
            <button
              className="cart-link-btn"
              onClick={() => setIsCartOpen(true)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <FaShoppingCart size={20} />
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <ThemeToggle />
          </nav>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <FaHome size={20} />
                <span>Home</span>
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                <FaBox size={20} />
                <span>Products</span>
              </Link>
              <button
                className="cart-link-btn"
                onClick={() => {
                  setIsCartOpen(true);
                  setIsMenuOpen(false);
                }}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <FaShoppingCart size={20} />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <ThemeToggle />
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSidebar cart={cart} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
};

// Cart Sidebar Component (Inline)
const CartSidebar = ({ cart, onClose }) => {
  const { removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>🛒 Your Cart</h2>
          <button onClick={onClose} className="cart-close-btn">✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p className="empty-cart-icon">🛍️</p>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items-sidebar">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-sidebar">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h4>{item.title}</h4>
                      <p className="cart-item-price">
                        ${formatPrice(item.price)}
                      </p>
                      <div className="cart-item-quantity">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-item-btn"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">USD ${formatPrice(cartTotal)}</span>
                </div>
                <Link to="/cart" onClick={onClose} className="btn-checkout">
                  View Full Cart
                </Link>
                <button onClick={clearCart} className="btn-clear-cart">
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
