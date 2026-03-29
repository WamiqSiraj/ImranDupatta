import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/authentication/user/authSlice';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});