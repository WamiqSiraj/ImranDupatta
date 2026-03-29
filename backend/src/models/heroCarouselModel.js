import mongoose from "mongoose";

const heroCarouselSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },

        buttonText: {
            type: String,
            default: "",
        },

        buttonLink: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const HeroCarousel = mongoose.model("HeroCarousel", heroCarouselSchema);

export default HeroCarousel;