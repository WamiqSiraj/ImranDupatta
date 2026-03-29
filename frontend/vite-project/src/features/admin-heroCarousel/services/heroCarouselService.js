import api from '../../../lib/axios'

// GET all slides
export const getSlides = async () => {
  const res = await api.get('/heroCarousel'); // ✅ matches backend GET "/"
  return res.data;
};

// CREATE slide
export const createSlide = async (formData) => {
  const res = await api.post('/heroCarousel', formData, { // ✅ matches backend POST "/"
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE slide
export const deleteSlide = async (id) => {
  const res = await api.delete(`/heroCarousel/${id}`); // ✅ matches backend DELETE "/:id"
  return res.data;
};