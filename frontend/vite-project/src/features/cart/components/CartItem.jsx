import React from 'react';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Destructure with a fallback for product to prevent crashing
  const { productId: product, quantity, price } = item;

  // GUARD: If product is null (deleted from DB), show a fallback UI
  if (!product) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div className="flex items-center gap-2 text-gray-400">
          <AlertCircle size={16} />
          <span className="text-xs italic">Item no longer available</span>
        </div>
        <button 
          onClick={() => onRemove(item._id)} // Use item ID to remove
          className="text-red-400 hover:text-red-600 p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  }

  // Safe Image Logic
  const displayImg = product.productImg?.[0]?.url || product.productImg?.[0] || '/placeholder.png';

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Product Image */}
      <div className="w-20 h-24 bg-[#F9F7F4] rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={displayImg} 
          alt={product.productName || 'Product'} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
              {product.productName || "Unnamed Product"}
            </h4>
            <button 
              onClick={() => onRemove(product._id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-[#7A3E3E] font-semibold mt-1">
            Rs. {price?.toLocaleString()}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1 bg-white">
            <button 
              onClick={() => onUpdateQuantity(product._id, 'decrease')}
              className="p-1 hover:bg-gray-50 rounded text-gray-500 disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-bold">{quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(product._id, 'increase')}
              className="p-1 hover:bg-gray-50 rounded text-gray-500"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-sm font-bold text-gray-900">
            Rs. {(price * quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;