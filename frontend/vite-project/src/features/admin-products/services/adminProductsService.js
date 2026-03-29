import api from '../../../lib/axios.js'

export const addProduct = async (formData) => {
   try {
      const response = await api.post('/product/addProduct', formData,
         { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      // FIX: Changed .formData to .data
      return response.data; 
   } catch (error) {
      console.error("Error while adding a Product:", error);
      // FIX: Added optional chaining and structured the throw
      throw error.response?.data?.message || "Network Error";
   }
}

export const getAllProduct = async (params = {}) => {
   try {
      // FIX: Ensure this matches your backend route (/getAllProduct)
      const response = await api.get('/product/getAllProduct', { params });
      return response.data;
   } catch (error) {
      console.error("Error fetching products:", error);
      throw error.response?.data || { message: "Network Error" };
   }
};

export const deleteProduct = async (productId) => {
   try {
      const response = await api.delete(`/product/deleteProduct/${productId}`);
      return response.data;
   } catch (error) {
      console.error("Error deleting product:", error);
      throw error.response?.data || { message: "Failed to delete product" };
   }
};

export const updateProduct = async (productId, formData) => {
   try {
      const response = await api.put(`/product/updateProduct/${productId}`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
   } catch (error) {
      console.error("Error updating product:", error);
      throw error.response?.data || { message: "Failed to update product" };
   }
};