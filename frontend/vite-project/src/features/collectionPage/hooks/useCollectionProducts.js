import { useState, useEffect } from 'react';
import { fetchAllProducts } from '../../homePage/services/productServices';

const useCollectionProducts = (categoryName) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(""); // Add this state

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        
        // Pass the sort order to your API if your backend supports it
        // If not, we will sort the data manually below
        const response = await fetchAllProducts({ category: formattedCategory });
        console.log(response);
        
        if (response && response.success && response.allProducts) {
         // 1. Create a fresh copy of the array
          let sortedData = [...response.allProducts];
          
          // 2. Apply sorting logic
          if (sortOrder === "low-to-high") {
            sortedData.sort((a, b) => Number(a.productPrice) - Number(b.productPrice));
          } else if (sortOrder === "high-to-low") {
            sortedData.sort((a, b) => Number(b.productPrice) - Number(a.productPrice));
          }

          setProducts(sortedData);
        } else {
          setProducts([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCollection();
    }
  }, [categoryName, sortOrder]); // Re-run when sortOrder changes

  return { products, loading, error, setSortOrder }; // Return setSortOrder
};

export default useCollectionProducts;