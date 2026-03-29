import React from 'react';
import SectionHeader from '../../../components/molecules/SectionHeader';
import ProductCard from '../../../components/molecules/ProductCard';
import  useProducts  from '../hooks/useProducts.js';

const CategorySection = ({ title, category }) => {
  // We pass the category and a limit of 4 to the hook
  const { products, loading, error } = useProducts({ 
    category: category,
    limit: 4 
  });

  if (error) return null; // Or show a small error message

  return (
  
    <section className="py-1 bg-[rgb(239,234,228)] ">
      <SectionHeader title={title} category={category} />
      {loading ? (
        <div className="grid grid-cols-2  md:grid-cols-4 gap-6">
          {/* Skeleton Loaders (Simple placeholders) */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;