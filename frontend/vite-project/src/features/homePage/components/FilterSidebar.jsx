import React from 'react';
import { useNavigate } from 'react-router-dom';

const FilterSidebar = ({ selectedFilters, onFilterChange, onApply }) => {
  const navigate = useNavigate();
  const categories = ['Abaya', 'Hijab', 'Dupatta', 'Shawl', 'Stoller', 'Kids'];
  const collections = ['New Arrival', 'Eid Special', 'Daily Basis', 'Winter', 'Summer'];

  // 1. Navigation for Categories
  const handleCategoryClick = (cat) => {
    navigate(`/collection/${cat.toLowerCase()}`);
  };

  // 2. Instant trigger for Collections
  const handleCollectionChange = (col) => {
    onFilterChange('collection', col);
    onApply(); 
  };

  return (
    <aside className="w-full md:w-45 pr-6 border-r bg-[rgb(219,194,189)] p-5 rounded-2xl border border-b-amber-950 
      sticky top-24 self-start 
      h-[calc(100vh-120px)] overflow-y-auto 
      scrollbar-hide hover:scrollbar-default transition-all"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Filters</h2>
        <button 
          onClick={() => {
            onFilterChange('clear');
            onApply();
          }}
          className="text-[10px] uppercase font-semibold text-gray-600 hover:text-[#7A3E3E] transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-12">
        {/* Categories Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-5 border-b border-gray-100 pb-2 text-gray-800">
            Categories
          </h3>
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => handleCategoryClick(cat)}
                className="text-left text-sm text-gray-700 hover:text-[#7A3E3E] hover:translate-x-1 transition-all duration-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-5 border-b border-gray-100 pb-2 text-gray-800">
            Collections
          </h3>
          <div className="space-y-4">
            {collections.map((col) => (
              <label key={col} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded-none accent-[#7A3E3E] cursor-pointer"
                  checked={selectedFilters.collection === col}
                  onChange={() => handleCollectionChange(col)}
                />
                <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                  {col}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Note for Sidebar */}
      <div className="mt-12 pt-6 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 italic">
          Select a category to view the full collection page.
        </p>
      </div>
    </aside>
  );
};

export default FilterSidebar;