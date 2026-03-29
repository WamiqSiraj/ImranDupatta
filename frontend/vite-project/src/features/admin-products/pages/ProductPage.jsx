import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAdminProducts } from '../hooks/useAdminProducts';
import ProductCard from '../components/ProductCard';
import ProductFormModal from '../components/ProductFormModel'; 
import ProductDetailModal from '../components/ProductDetailModel';

const ProductPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    collection: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
const [viewProduct, setViewProduct] = useState(null);

  const { products, loading, error, refresh, removeProduct } = useAdminProducts(filters);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
          <p className="text-gray-500 text-sm">Manage your product inventory with detailed information</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-4xl border border-gray-300 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <select 
          name="category"
          value={filters.category}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600 cursor-pointer"
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="Abaya">Abaya</option>
          <option value="Hijab">Hijab</option>
          <option value="Dupatta">Dupatta</option>
          <option value="Shawl">Shawl</option>
          <option value="Stoller">Stoller</option>
          <option value="Kids">Kids</option>
        </select>

        <select 
          name="collection"
          value={filters.collection}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600 cursor-pointer"
          onChange={handleFilterChange}
        >
          <option value="">All Collections</option>
          <option value="New Arrival">New Arrival</option>
          <option value="Eid Special">Eid Special</option>
          <option value="Daily Basis">Daily Basis</option>
          <option value="Winter">Winter</option>
          <option value="Summer">Summer</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-xl text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onEdit={openEditModal}
              onDelete={removeProduct}
              onView={(p) => setViewProduct(p)} // Pass the view handler
            />
          ))}
        </div>
      )}

      {/* Modal is now active */}
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct}
        onSuccess={refresh}
      />

      {/* Clickable Product detail model */}
<ProductDetailModal 
  isOpen={!!viewProduct} 
  onClose={() => setViewProduct(null)} 
  product={viewProduct} 
/>
    </div>
  );
};

export default ProductPage;