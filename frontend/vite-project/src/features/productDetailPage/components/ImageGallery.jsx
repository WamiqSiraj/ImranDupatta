import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react'; // Icons for Expand and Close

const ImageGallery = ({ images = [] }) => {
  const displayImages = images.slice(0, 5);
  const [activeImage, setActiveImage] = useState(displayImages[0]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the full-screen view

  // Sync active image when data loads
  useEffect(() => {
    if (displayImages.length > 0) setActiveImage(displayImages[0]);
  }, [images]);

  if (!displayImages.length) return <div className="aspect-square bg-gray-100 rounded-2xl" />;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Large Image Container */}
      <div className="relative group w-full aspect-square bg-[rgb(219,194,189)] rounded-2xl overflow-hidden border border-gray-100">
        <img 
          src={activeImage} 
          alt="Product view" 
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={() => setIsModalOpen(true)} // Click image to expand too
        />

        {/* The Expand Icon Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 p-3 bg-[rgb(239,234,228)] backdrop-blur-sm rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
          title="View Full Image"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              activeImage === img ? 'border-[#7A3E3E]' : 'border-transparent opacity-60'
            }`}
          >
            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* --- FULL SCREEN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Close Button */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform duration-300 z-[1000]"
          >
            <X size={40} />
          </button>

          {/* Full Image */}
          <img 
            src={activeImage} 
            alt="Full view" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;