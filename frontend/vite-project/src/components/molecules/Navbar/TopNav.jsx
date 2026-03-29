import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TopNav = () => {
  const navigate = useNavigate();
  const categories = ["Dupatta", "Stollers", "Abaya", "Hijab", "Shawl", "Kids"];
  // 1. Navigation for Categories
  const handleCategoryClick = (cat) => {
    navigate(`/collection/${cat.toLowerCase()}`);
  };
  return (
    <div className="container mx-auto px-4 h-14 flex items-center justify-between">
      <div className="text-xl font-serif font-bold text-[#7A3E3E]">
        <Link to={"/"}>Imran <span className="font-light text-gray-400 italic">Dupatta</span></Link>
        
      </div>

      <ul className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-gray-800">
        {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => handleCategoryClick(cat)}
                className="text-left text-sm text-gray-700 hover:text-[#7A3E3E] hover:translate-x-1 transition-all duration-200"
              >
                {cat}
              </button>
            ))}
      </ul>

      <div className="flex items-center gap-4 text-[13px] font-medium">
        <Link to={"/user/login"}>Login</Link>
        <Link
          className="bg-[#7A3E3E] text-white px-4 py-1.5 rounded-sm"
          to={"/user/register"}
        >
          Sign up
        </Link>

        <Link to={"/user/logout"}>Logout</Link>
      </div>
    </div>
  );
};

export default TopNav;
