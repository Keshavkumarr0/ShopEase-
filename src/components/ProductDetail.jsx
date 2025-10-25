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
    if (products.length > 0 && id) {
      // Try multiple matching strategies
      const found = products.find((p) => {
        // Strategy 1: Direct match
        if (p.id === id) return true;
        
        // Strategy 2: Extract numeric ID from Shopify GID
        if (typeof p.id === 'string' && p.id.includes('gid://shopify/Product/')) {
          const numericId = p.id.split('/').pop();
          if (numericId === id) return true;
        }
        
        // Strategy 3: Convert both to string and compare
        const productIdStr = p.id.toString();
        if (productIdStr === id || productIdStr.endsWith(id)) return true;
        
        // Strategy 4: Handle encoded IDs
        const decodedId = decodeURIComponent(id);
        if (p.id === decodedId || productIdStr === decodedId) return true;
        
        return false;
      });

      if (found) {
        console.log('✅ Product found:', found);
        setProduct(found);
      } else {
        console.log('❌ Product not found. ID:', id);
        console.log('Available products:', products.map(p => ({ id: p.id, title: p.title })));
        setProduct(null);
      }
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="error" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Product not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            The product you're looking for doesn't exist.
          </p>
          <button 
            className="back-btn" 
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FaArrowLeft size={20} /> Go to Home
          </button>
        </div>
      </div>
    );
  }

  const price = product.price || "0.00";
  const image = product.image || PLACEHOLDER_IMAGE;
  const imageAlt = product.imageAlt || product.title || "Product image";
  const description = product.description || "No description available.";

  const handleAddToCart = () => {
    try {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        variantId: product.variantId,
        quantity: 1
      });
      alert(`✅ ${product.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Failed to add to cart');
    }
  };

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} /> Back
      </button>

      <div className="product-detail">
        <div className="product-detail-image">
          <img 
            src={image} 
            alt={imageAlt} 
            onError={(e) => {
              console.log('Image load failed, using placeholder');
              e.target.src = PLACEHOLDER_IMAGE;
            }} 
          />
        </div>

        <div className="product-detail-info">
          <h1>{product.title}</h1>
          
          <p className="price">
            ${parseFloat(price).toFixed(2)}
            {product.currency && ` ${product.currency}`}
          </p>
          
          <p className="description">{description}</p>
          
          <button 
            className="add-btn" 
            onClick={handleAddToCart}
            disabled={!product.availableForSale}
          >
            <FaShoppingCart size={22} />
            {product.availableForSale !== false ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

