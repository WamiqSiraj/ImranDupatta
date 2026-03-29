import React from "react";
import { useHeroCarousel } from "../hooks/useHeroCarousel";
import HeroSlideForm from "../components/HeroSlideForm";
import HeroSlideList from "../components/HeroSlideList";

const HeroCarouselPage = () => {
  const { slides, loading, addSlide, removeSlide } = useHeroCarousel();

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Hero Carousel</h1>

      {/* FORM */}
      <HeroSlideForm onSubmit={addSlide} />

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      <HeroSlideList slides={slides} onDelete={removeSlide} />

    </div>
  );
};

export default HeroCarouselPage;