import api from '../../../lib/axios';

export const cartService = {
  // params will contain { guestId } for guests
  getCart: async (params) => {
    const response = await api.get('/cart/getCart', { params });
    return response.data; 
  },

  // Now accepts guestId as an argument from the thunk
  addToCart: async ({ productId, quantity, guestId }) => {
    const response = await api.post('/cart/addToCart', {
      productId,
      quantity,
      guestId 
    });
    return response.data;
  },


  updateQuantity: async ({ productId, type, guestId }) => {
    const response = await api.put('/cart/updateQuantity', { 
        productId, 
        type, 
        guestId 
    });
    return response.data;
  },

  
  removeItem: async ({ productId, guestId }) => {
    const response = await api.delete(`/cart/removeFromCart/${productId}`, { 
        data: { guestId } 
    });
    return response.data;
  }
};