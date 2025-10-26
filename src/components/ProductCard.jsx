import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useState, memo } from "react";
import { useCart } from "../context/CartContext";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8e8e8' width='400' height='400'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='18' font-family='Arial'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;

const ProductCard = memo(({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  // ✅ More robust product ID extraction
  const getProductId = () => {
    if (typeof product?.id === "string" && product.id.includes("gid://shopify/Product/")) {
      return product.id.split("/").pop();
    }
    return product?.id;
  };

  const handleCardClick = (e) => {
    // Prevent navigation if Add to Cart clicked
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

  const imageSrc = imageError ? PLACEHOLDER_IMAGE : product?.image || PLACEHOLDER_IMAGE;
  const price = product?.price || "N/A";
  const imageAlt = product?.imageAlt || product?.title || "Product image";

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      tabIndex={0} // ✅ accessibility: make it focusable
      onKeyDown={(e) => e.key === "Enter" && handleCardClick(e)} // keyboard navigation
    >
      <div className="product-card-image">
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          onError={handleImageError}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            objectFit: "cover",
            borderRadius: "8px",
            transition: "transform 0.3s ease",
          }}
        />
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title" title={product?.title}>
          {product?.title || "Untitled Product"}
        </h3>
        <p className="product-card-price">${price}</p>

        <button
          className="product-card-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${product?.title || "product"} to cart`}
        >
          <FaShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
});

export default ProductCard;
