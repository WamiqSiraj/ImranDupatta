import api from '../../../lib/axios'

export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/product/getProduct/${id}`)
        // Based on controller, the data is inside 'response.data.product'
        return response.data.product;
    } catch (error) {
        return error.response?.data?.message || "Failed to fetch Product Details"
    }
}

