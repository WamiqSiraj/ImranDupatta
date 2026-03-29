import api from '../../../lib/axios';

export const checkoutService = {
  placeOrder: async (orderData) => {
    const response = await api.post('/order/place-order', orderData);
    return response.data;
  }
};