import React, { useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import FilterSidebar from '../components/FilterSidebar';
import CategorySection from '../components/CategorySection';
const HomePage = () => {
  // Local state to manage filters before "Applying" them
  const [filters, setFilters] = useState({
    category: '',
    collection: '',
    maxPrice: 10000,
  });

  // State that actually triggers the API call
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleFilterChange = (type, value) => {
    if (type === 'clear') {
      setFilters({ category: '', collection: '', maxPrice: 10000 });
      setAppliedFilters({});
      return;
    }
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleApply = () => {
    setAppliedFilters(filters);
  };

return (
  <div className="flex flex-col min-h-screen bg-[rgb(239,234,228)]">
    {/* Hero Carousel stays full width */}
    <HeroCarousel />

    {/* This container needs to be flex-row to put Sidebar on the left */}
    <div className="container mx-auto px-4 md:px-6 lg:px-0  flex flex-col md:flex-row gap-10">
      
      {/* Sidebar - Fix width so it doesn't stretch */}
      <div className="w-full md:w-40 flex-shrink-0">
        <FilterSidebar 
          selectedFilters={filters} 
          onFilterChange={handleFilterChange} 
          onApply={handleApply} 
        />
      </div>

      {/* Content Area - Ensure it takes remaining space */}
      <div className="flex-1 pb-20">
        {Object.values(appliedFilters).some(v => v !== '' && v !== 10000) ? (
          <CategorySection 
            title="Search Results" 
            category={appliedFilters.category} 
          />
        ) : (
          <div className="space-y-12 "> {/* Adds spacing between rows */}
            <CategorySection title="Dupatta Collection" category="Dupatta" />
            <CategorySection title="Shawl Collection" category="Shawl" />
            <CategorySection title="Abaya Collection" category="Abaya" />
            <CategorySection title="Hijab Collection" category="Hijab" />
            <CategorySection title="Stoller Collection" category="Stoller" />
            <CategorySection title="Kids Collection" category="Kids" />
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default HomePage;