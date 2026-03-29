import React, { useState } from 'react';
import { X } from 'lucide-react';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  // State to track which image is currently being viewed in the large preview
  const [mainImage, setMainImage] = useState(product.productImg[0]?.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* LEFT: Image Gallery */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col gap-4">
          <div className="relative h-80 w-full rounded-xl overflow-hidden bg-white border">
            <img src={mainImage} alt="Main Preview" className="w-full h-full object-contain" />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.productImg.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setMainImage(img.url)}
                className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${mainImage === img.url ? 'border-blue-600' : 'border-transparent'}`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>

          <div className="space-y-6">
            <div>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">{product.collection}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">{product.productName}</h2>
              <p className="text-2xl font-semibold text-gray-800 mt-2">${product.productPrice}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y py-4 border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase">Category</p>
                <p className="font-medium text-gray-700">{product.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Fabric</p>
                <p className="font-medium text-gray-700">{product.fabric}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Stock Status</p>
                <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">Description</p>
              <p className="text-gray-600 leading-relaxed">{product.productDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;