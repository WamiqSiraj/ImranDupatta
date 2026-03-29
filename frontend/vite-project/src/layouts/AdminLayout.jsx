import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Menu, X, BarChart3, Image as ImageIcon  } from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <LayoutDashboard size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },

    // ✅ NEW HERO CAROUSEL
    { name: 'Hero Carousel', path: '/admin/hero-carousel', icon: <ImageIcon size={20} /> },
  ];
  // ✅ Better active check (important for nested routes)
  const isActive = (path) => location.pathname.startsWith(path);


  const NavLinks = () => (
    <div className="flex flex-col gap-2 p-4">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === item.path 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* 1. DESKTOP SIDEBAR (Visible only on md and up) */}
      <aside className="hidden md:flex w-64 bg-gray-100 border-r border-gray-200 flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 pb-1">Admin Panel</h1>
          <p className='font-bold'>Imran Dupatta</p>
        </div>
        <NavLinks />
      </aside>

      {/* 2. MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-40">
        <h1 className="text-lg font-bold text-blue-600">Admin</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 3. MOBILE DRAWER (Overlay) */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden shadow-xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">Admin</h1>
            </div>
            <NavLinks />
          </aside>
        </>
      )}

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 w-full pt-20 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;