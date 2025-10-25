import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8e8e8' width='400' height='400'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='18' font-family='Arial'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const getProductId = () => {
    if (typeof product.id === "string" && product.id.includes("gid://shopify/Product/")) {
      return product.id.split("/").pop();
    }
    return product.id;
  };

  const handleCardClick = (e) => {
    if (e.target.closest(".product-card-btn")) return;
    navigate(`/product/${getProductId()}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      e.target.src = PLACEHOLDER_IMAGE;
    }
  };

  const image = product.image || PLACEHOLDER_IMAGE;
  const price = product.price || "N/A";
  const imageAlt = product.imageAlt || product.title || "Product image";

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-image">
        <img src={image} alt={imageAlt} loading="lazy" onError={handleImageError} />
        {/* ❌ REMOVED: Quick View Overlay */}
        {/* 
        <div className="product-card-overlay">
          <FaEye size={20} />
          <span>Quick View</span>
        </div>
        */}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-price">${price}</p>
        <button className="product-card-btn" onClick={handleAddToCart}>
          <FaShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
