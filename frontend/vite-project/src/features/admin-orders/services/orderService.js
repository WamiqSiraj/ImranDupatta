import api from '../../../lib/axios';

export const adminOrderService = {
  // Get all orders from the database
  getAllOrders: async () => {
    const response = await api.get('/order/admin/all-orders');
    return response.data.orders;
  },
  
  // Update status (Pending, Shipped, etc.)
  updateStatus: async (orderId, status) => {
    const response = await api.put(`/order/admin/update-status/${orderId}`, { status });
    return response.data.order;
  }
};