import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  // Destructure the product data from your MongoDB schema
  const {
    _id,
    productName,
    productDescription,
    productPrice,
    fabric,
    category,
    collection,
    stock,
    productImg,
  } = product;

  // Use the first image from the array, or a placeholder if empty
  const displayImage = productImg?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div onClick={() => onView(product)} //trigger view on click
    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 1. Image & Badges Section */}
      <div className="relative h-64 w-full">
        <img
          src={displayImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
        {/* Collection Badge (e.g., New Arrival) */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
          {collection}
        </span>
        {/* If there are more than 1 image, show a small indicator */}
        {productImg?.length > 1 && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
            +{productImg.length - 1} more
          </span>
        )}
      </div>

      {/* 2. Content Section */}
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {/* Category Badge */}
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">
            {category}
          </span>
          {/* Stock Badge */}
          <span className={`text-xs px-2 py-0.5 rounded ${stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
            Stock: {stock}
          </span>
        </div>

        <h3 className="font-bold text-gray-800 text-lg truncate">{productName}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mt-1 h-10">
          {productDescription}
        </p>
        
        <p className="text-xs text-gray-400 mt-2 italic">Fabric: {fabric}</p>
        
        <div className="mt-1 text-2xl font-bold text-blue-600">
          Rs {Number(productPrice).toFixed(2)}
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center gap-2 mt-1 pt-4 border-t border-gray-100">
   
          <button 
             onClick={(e) => { e.stopPropagation(); onEdit(product); }} // Prevent modal open
            className="flex-1 flex items-center justify-center gap-2 text-sm bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Pencil size={16} /> Edit
          </button>

          <button 
             onClick={(e) => { e.stopPropagation(); onDelete(product._id); }} // Prevent modal open
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;