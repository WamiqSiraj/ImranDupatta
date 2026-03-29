import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from './services/cartService';

// Fetch Cart
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCart', 
  async (params, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart(params); 
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
});

// Add to Cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

// Update Quantity
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartService.updateQuantity(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// Remove Item
export const removeItemAsync = createAsyncThunk(
  'cart/removeItem',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartService.removeItem(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Removal failed");
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    isModalOpen: false,
    loading: false,
    error: null,
  },
  reducers: {
    toggleCartModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    closeCartModal: (state) => {
      state.isModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    // Helper function to update state from backend response
    const handleCartSuccess = (state, action) => {
      state.loading = false;
      const cartData = action.payload?.data || action.payload?.cart;
      state.items = cartData?.items || [];
      state.totalPrice = cartData?.totalPrice || 0;
    };

    builder
      .addCase(fetchCartItems.pending, (state) => { state.loading = true; })
      .addCase(fetchCartItems.fulfilled, handleCartSuccess)
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart cases
      .addCase(addToCartAsync.fulfilled, handleCartSuccess)
      // Update Quantity cases
      .addCase(updateQuantityAsync.fulfilled, handleCartSuccess)
     // Remove Item cases
      .addCase(removeItemAsync.fulfilled, handleCartSuccess);
  },
});
export const { toggleCartModal, closeCartModal } = cartSlice.actions;
export default cartSlice.reducer;