import React from 'react';

const ProductInfo = ({ product }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Category & Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[#7A3E3E] font-medium uppercase tracking-wider text-sm">
          {product.category}
        </span>
        {product.collection && (
          <span className="bg-[#7A3E3E] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.collection}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
        {product.productName}
      </h1>
      <p className="text-gray-500 text-lg leading-relaxed">
        {product.productDescription}
      </p>

      {/* Price */}
      <div className="mt-4">
        <span className="text-3xl font-bold text-[#7A3E3E]">
          Rs. {product.productPrice?.toLocaleString()}
        </span>
      </div>

      {/* Stock Warning */}
      {product.stock < 10 && product.stock > 0 && (
        <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mt-2">
          <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
          Only {product.stock} left in stock!
        </div>
      )}
    </div>
  );
};

export default ProductInfo;