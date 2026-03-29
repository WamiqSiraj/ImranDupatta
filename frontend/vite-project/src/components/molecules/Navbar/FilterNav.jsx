import React, { useState } from "react";
import { Search, ShoppingCart, ChevronDown, Filter } from "lucide-react";
// 1. Import Redux Hooks and Action
import { useDispatch, useSelector } from "react-redux";
import { toggleCartModal } from "../../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAdminProducts } from '../../../features/admin-products/hooks/useAdminProducts';

const FilterNav = ({ onToggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  // 2. Initialize Redux dispatch and grab cart items
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  //total products
  const cartCount = items.length;
  // Calculate total quantity (Sum of all item quantities)
  //const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const categories = ["Abaya", "Hijab", "Dupatta", "Shawl", "Stoller", "Kids"];
  //  Navigation for Categories
  const handleCategoryClick = (cat) => {
    navigate(`/collection/${cat.toLowerCase()}`);
  };
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    collection: '',
  });

  const { products, loading, error } = useAdminProducts(filters);
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelect = (type, value) => {
    onFilterChange(type, value);
    onApply();
    setOpenDropdown(null);
  };

  const handleSearch = (e) => {
    onFilterChange("search", e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onApply();
    }
  };

  return (
    <div className="border-t border-gray-50 bg-[#e7e2dc]">
      <div className="container mx-auto px-14 h-14 flex items-center gap-14">
        {/* Search Bar */}
        <div className="flex-1 max-w-sm relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search products, collections..."
            className="w-full bg-gray-50 border border-gray-100 py-2 pl-10 pr-4 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3E3E]"
             value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-100 hover:bg-gray-50"
          >
            <Filter size={14} />{" "}
            <span className="text-xs font-semibold uppercase">Filters</span>
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "cat" ? null : "cat")
              }
              className="flex items-center gap-1 px-3 py-2 text-[13px] text-gray-600 border border-gray-100 hover:bg-gray-50"
            >
              Categories{" "}
              <ChevronDown
                size={14}
                className={openDropdown === "cat" ? "rotate-180" : ""}
              />
            </button>
            {openDropdown === "cat" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 shadow-xl z-[60] py-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCategoryClick(c)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#7A3E3E] rounded-2xl hover:text-[#ededed]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Collections Dropdown */}
          <div className="relative">
             <select 
          name="collection"
          value={filters.collection}
          className="flex items-center gap-1 px-3 py-2 text-[13px] text-gray-600 border border-gray-100 hover:bg-gray-50"
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
        </div>

        {/* 3. Updated Cart Button with Toggle Logic and Badge */}
        <button
          onClick={() => dispatch(toggleCartModal())}
          className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-100 text-gray-700 bg-white hover:bg-amber-300 rounded-3xl relative transition-all active:scale-95"
        >
          <ShoppingCart size={18} />
          <span className="text-[13px] font-medium">Cart</span>

          {/* Notification Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#7A3E3E] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default FilterNav;
