import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../../components/molecules/ProductCard";
import useCollectionProducts from "../hooks/useCollectionProducts";
import CollectionHeader from "../components/CollectionHeader";
import SortDropdown from "../components/SortDropdown";
const CollectionPage = () => {
  const { categoryName } = useParams();

  // We pass the categoryName string.
  // Note: Ensure your hook is expecting an object { category: ... } or just the string.
  // I am using the object structure to match your fetchAllProducts pattern.
  const { products, loading, error, setSortOrder } =
    useCollectionProducts(categoryName);

  return (
    <div className="bg-[rgb(239,234,228)] min-h-screen">
      <div className="container mx-auto px-4 py-8">
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-3 gap-4">
        {/* Header with Title and Back Button */}
        <CollectionHeader title={categoryName} count={products?.length || 0} />
        {!loading && products.length > 0 && (
          <SortDropdown onSortChange={setSortOrder} />
        )}
      </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7A3E3E]"></div>
            <p className="text-gray-400 text-sm animate-pulse">
              Loading {categoryName} Collection...
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">Unable to load products.</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {/* 3. Empty State (Crucial for debugging the Stoller 404/Empty issue) */}
        {!loading && !error && products?.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-500 text-lg">
              No products found in this collection.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Please try a different category or check back later.
            </p>
          </div>
        )}

        {/* 4. Product Grid */}
        {!loading && !error && products?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
