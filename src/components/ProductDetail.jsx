import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect fill='%23e8e8e8' width='600' height='600'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='24' font-family='Arial'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => {
        const productId = typeof p.id === 'string' && p.id.includes('gid://shopify/Product/')
          ? p.id.split('/').pop()
          : p.id.toString();
        return productId === id;
      });
      setProduct(found);
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft size={20} /> Go to Home
        </button>
      </div>
    );
  }

  const price = product.price || "N/A";
  const image = product.image || PLACEHOLDER_IMAGE;
  const imageAlt = product.imageAlt || product.title || "Product image";

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} /> Back
      </button>

      <div className="product-detail">
        <div className="product-detail-image">
          <img src={image} alt={imageAlt} onError={(e) => e.target.src = PLACEHOLDER_IMAGE} />
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="price">${price}</p>
          <p className="description">{product.description || "No description available."}</p>
          <button className="add-btn" onClick={() => addToCart(product, 1)}>
            <FaShoppingCart size={22} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
