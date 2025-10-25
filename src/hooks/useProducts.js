import { useState, useEffect } from "react";
import { shopifyService } from "../services/shopifyService";

export const useProducts = (initialLimit = 12) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);

  // 👇 Load products on first render
  useEffect(() => {
    loadProducts();
  }, []);

  // 👇 Fetch products from Shopify
  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await shopifyService.fetchProducts(initialLimit, cursor);

      // Merge old + new products safely
      setProducts((prev) => [...prev, ...result.products]);

      // Update pagination info
      setHasMore(result.pageInfo?.hasNextPage ?? false);
      setCursor(result.pageInfo?.endCursor ?? null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Public method for infinite scroll
  const loadMore = () => {
    if (hasMore && !loading) {
      loadProducts();
    }
  };

  // ✅ Return state + helpers
  return { products, loading, error, hasMore, loadMore };
};
 