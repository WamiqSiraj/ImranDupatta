import { useState, useEffect } from 'react';
import { fetchAllProducts } from '../services/productServices';

const useProducts = (queryParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts(queryParams);
      if (data.success) {
        setProducts(data.allProducts);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [JSON.stringify(queryParams)]); // Re-fetch if filters change

  return { products, loading, error, refresh: getProducts };
};
export default useProducts;