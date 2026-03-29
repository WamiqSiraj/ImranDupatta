import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems } from './features/cart/cartSlice';

// Components & Layouts
import ScrollToTop from "./components/molecules/ScrollToTop";
import AdminLayout from "./layouts/AdminLayout";
import HomePageLayout from "./layouts/HomePageLayout";

// Pages
import RegisterPage from "./features/authentication/user/pages/RegisterPage";
import LoginPage from "./features/authentication/user/pages/LoginPage";
import LogoutPage from "./features/authentication/user/pages/LogoutPage"
import ProductPage from "./features/admin-products/pages/ProductPage";
import HomePage from "./features/homePage/pages/HomePage";
import CollectionPage from "./features/collectionPage/pages/CollectionPage";
import ProductDetailPage from "./features/productDetailPage/pages/ProductDetailPage";
import HeroCarouselPage from "./features/admin-heroCarousel/pages/HeroCarouselPage";
import CartPage from "./features/cart/pages/CartPage";
import OrderPage from "./features/admin-orders/pages/OrderPage"
import CheckoutPage from "./features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "./features/checkout/pages/OrderSuccessPage"
// Cart Feature
import CartModal from './features/cart/components/CartModal';
import { getOrCreateGuestId } from './utils/guestId';

const App = () => {
  const dispatch = useDispatch();
// Extract user from the auth slice we just created
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    const guestId = getOrCreateGuestId();
    
    // Pass the guestId object to the thunk
    dispatch(fetchCartItems({ guestId }));
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      {/* 1. Global Helpers & UI Components (Outside Routes) */}
      <ScrollToTop />
      <CartModal /> 

      <Routes>
        {/* 2. Authentication Routes */}
        <Route path="/user/register" element={<RegisterPage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/logout" element={<LogoutPage />} />

        {/* 3. Admin Dashboard Routes (No Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="hero-carousel" element={<HeroCarouselPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="analytics" element={<div className="p-4">Analytics Page (Coming Soon)</div>} />
        </Route>

        {/* 4. Main Website Routes (Wrapped in Navbar + Footer) */}
        <Route path="/" element={<HomePageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="collection/:categoryName" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;