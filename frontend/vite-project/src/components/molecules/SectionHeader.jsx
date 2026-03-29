import { Link } from "react-router-dom";

// 1. Add 'category' to the props here
const SectionHeader = ({ title, category }) => {
  // 2. Add a fallback to prevent errors if category is missing
  const safeCategory = category ? category.toLowerCase() : "all";

  return (
    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
      <h2 className="text-2xl font-bold text-gray-800 tracking-wide">{title}</h2>
      <Link 
        to={`/collection/${safeCategory}`} 
        className="text-sm font-medium bg-[#7A3E3E] px-4 py-1.5 rounded-sm text-white hover:rounded-2xl flex items-center gap-1 "
      >
        See More <span>&rarr;</span>
      </Link>
    </div>
  );
};

export default SectionHeader;
