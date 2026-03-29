import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductDetails from '../hooks/useProductDetail';

import ImageGallery from '../components/ImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductActions from '../components/ProductActions';
import ProductSpecs from '../components/ProductSpecs';
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetails(id);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 italic">
      Loading product details...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );
``
  return (
    <div className="bg-[#EFEAE4] min-h-screen pb-5">
      <div className="container mx-auto px-4 py-3">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-800 font-medium mb-3 hover:text-shadow-black transition-opacity"
        >
          <span>&larr;</span> Back to Shop
        </button>

        {/* Main Content Card */}
        <div className="bg-[rgb(219,194,189)] rounded-3xl p-6 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side: Image Gallery Placeholder */}
            <div className="w-full aspect-square bg-[rgb(219,194,189)] p-2 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
               {/* <ImageGallery images={product.productImages} /> */}
              <ImageGallery images={product.productImg?.map(img => img.url)}/>
            </div>

            {/* Right Side: Product Info Placeholder */}
            <div className="flex flex-col">
               {/* <ProductInfo product={product} /> */}
               <ProductInfo product={product}/>
               <ProductActions product={product}/>
               {/* <ProductSpecs product={product}/> */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;