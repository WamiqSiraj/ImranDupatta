import React from 'react';

const ProductSpecs = ({ product }) => {
  const specs = [
    { label: "Category", value: product.category },
    { label: "Collection", value: product.collection || "General" },
    { label: "Fabric", value: product.fabric || "Premium Quality" },
    { label: "Available Stock", value: `${product.stock} units` },
    { label: "SKU", value: product.sku || `PROD-${product._id?.slice(-5).toUpperCase()}` },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Product Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
        {specs.map((spec, index) => (
          <div key={index} className="flex justify-between py-3 border-b border-gray-50">
            <span className="text-gray-500 font-medium">{spec.label}</span>
            <span className="text-gray-900 font-semibold">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecs;