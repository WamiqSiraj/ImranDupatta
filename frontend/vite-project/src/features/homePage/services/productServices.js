import api from '../../../lib/axios'

export const fetchAllProducts = async (params) => {
  try {
    // This matches your backend getAllProduct controller which expects query params
    const response = await api.get('/product/getAllProduct', { params });
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};