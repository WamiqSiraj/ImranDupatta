import { useState, useEffect, useCallback } from 'react';
import { getAllProduct, deleteProduct } from '../services/adminProductsService';
import { toast } from 'react-toastify';

export const useAdminProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Products Logic
  // Using useCallback to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProduct(filters);
      
      // Note: Your backend returns { success: true, allProducts: [...] }
      setProducts(data.allProducts || []);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 2. Initial Load & Filter Re-fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. Delete Product Logic
  const removeProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      // Optimistic Update: Remove from local state immediately
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast("Product deleted successfully")
      return { success: true };
     
    } catch (err) {
      const msg = err.message || "Delete failed";
      alert(msg);
      return { success: false, error: msg };
    }
  };

  return {
    products,
    loading,
    error,
    refresh: fetchProducts, // Allows manual refresh (e.g., after adding/editing)
    removeProduct
  };
};