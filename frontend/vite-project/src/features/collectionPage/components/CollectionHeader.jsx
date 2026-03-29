import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CollectionHeader = ({ title, count }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-10">
      <button 
        onClick={() => navigate(-1)} 
        className="p-2 hover:bg-white rounded-full shadow-sm transition-all border border-gray-100"
      >
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-800 capitalize">
          {title} Collection
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {count} products found
        </p>
      </div>
    </div>
  );
};

export default CollectionHeader;