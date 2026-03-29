import { Outlet } from 'react-router-dom';
import Navbar from '../components/molecules/Navbar/NavBar';
import Footer from '../components/molecules/Footer';

const HomePageLayout = () => {
  return (
    <div className="flex flex-col bg-[rgb(239,234,228)] min-h-screen">
      {/* Fixed or Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 md:px-10 py-0">
        <Outlet />
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};
//bg-[rgb(239,234,228)]
//bg-[rgb(219,194,189)]
export default HomePageLayout;