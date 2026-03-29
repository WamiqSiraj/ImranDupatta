import TopNav from './TopNav';
import FilterNav from './FilterNav';

const Navbar = (props) => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <TopNav />
      <FilterNav {...props} />
    </nav>
  );
};

export default Navbar;