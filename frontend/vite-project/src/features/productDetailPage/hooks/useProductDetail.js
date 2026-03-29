import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/productDetailService';

const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      getProductData();
    }
  }, [productId]);

  return { product, loading, error };
};

export default useProductDetails;