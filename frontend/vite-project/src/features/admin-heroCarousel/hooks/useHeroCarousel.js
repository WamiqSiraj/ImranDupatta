import { useEffect, useState } from "react";
import * as service from "../services/heroCarouselService";

export const useHeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await service.getSlides();
      
      // ✅ FIX: Extract the 'slides' array from the backend response object
      // We use 'response.slides || []' as a safety net to ensure it's always an array
      setSlides(response.slides || []);
      
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      setSlides([]); // Reset to empty array on error to prevent .map() crashes
    } finally {
      setLoading(false);
    }
  };

  const addSlide = async (formData) => {
    try {
      await service.createSlide(formData);
      await fetchSlides(); // Refresh list after adding
    } catch (error) {
      console.error("Error adding slide:", error);
    }
  };

  const removeSlide = async (id) => {
    try {
      await service.deleteSlide(id);
      await fetchSlides(); // Refresh list after deleting
    } catch (error) {
      console.error("Error removing slide:", error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  return { slides, loading, addSlide, removeSlide };
};