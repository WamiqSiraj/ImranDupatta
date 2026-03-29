import React from "react";

const HeroSlideList = ({ slides, onDelete }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">

      {slides.map((slide) => (
        <div key={slide._id} className="border rounded-lg p-3">

          <img
            src={slide.image}
            alt="image"
            className="w-full h-40 object-cover rounded"
          />

          <button
            onClick={() => onDelete(slide._id)}
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
};

export default HeroSlideList;