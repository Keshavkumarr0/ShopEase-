import React from "react";
import { FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="btn-continue-shopping" onClick={() => navigate("/")}>
            <FaArrowLeft size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <button className="back-btn-cart" onClick={() => navigate("/")}>
          <FaArrowLeft size={18} />
          <span>Continue Shopping</span>
        </button>
        <h1>
          <FaShoppingCart size={28} /> Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="cart-content-wrapper">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div className="cart-item-card" key={item.id}>
              <div className="cart-item-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-img"
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e8e8e8' width='150' height='150'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='12' font-family='Arial'%3ENo Image%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>

              <div className="cart-item-info-section">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-price-single">${parseFloat(item.price).toFixed(2)} each</p>
                
                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button 
                      className="quantity-btn-cart"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn-cart"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    <FaTrash size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                <p className="item-subtotal-label">Subtotal</p>
                <p className="item-subtotal-price">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cart.length})</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span className="total-amount">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-checkout-cart">
              Proceed to Checkout
            </button>

            <button className="btn-clear-cart-page" onClick={clearCart}>
              <FaTrash size={14} />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="secure-checkout-badge">
            🔒 Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
