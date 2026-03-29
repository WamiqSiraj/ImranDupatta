import api from '../../../lib/axios';

export const fetchHeroCarousel = async () => {
  try {
    const response = await api.get('/heroCarousel'); // ✅ matches backend GET "/"
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};