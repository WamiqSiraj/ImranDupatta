import React from 'react';

const SortDropdown = ({ onSortChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-600">Sort by:</label>
      <select 
        id="sort"
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-[rgb(219,194,189)] rounded-3xl text-black text-sm focus:ring-[#7A3E3E] focus:border-[#7A3E3E] block p-2.5 outline-none"
      >
        <option value="">Default</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
        
      </select>
    </div>
  );
};

export default SortDropdown;