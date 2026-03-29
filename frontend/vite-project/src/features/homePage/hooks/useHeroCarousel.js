// useHeroCarousel.js
import { useEffect, useState } from "react";
// Change 'getSlides' to 'fetchHeroCarousel'
import { fetchHeroCarousel } from "../services/heroCarouselService"; 

export const useHeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSlidesData = async () => { // Renamed local function to avoid confusion
    try {
      const response = await fetchHeroCarousel(); // Match the imported name
      const allSlides = response.slides || [];
      const activeSlides = allSlides.filter(slide => slide.isActive);
      setSlides(activeSlides);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSlidesData();
  }, []);

  return { slides, loading };
};