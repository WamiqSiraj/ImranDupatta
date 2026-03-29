import HeroCarousel from "../models/heroCarouselModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// CREATE SLIDE (WITH IMAGE UPLOAD)
export const createSlide = async (req, res) => {
  try {
    const { buttonText, buttonLink } = req.body;

    // multer gives file in req.file
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // upload to cloudinary
    const result = await uploadOnCloudinary(req.file.path);

    const slide = await HeroCarousel.create({
      image: result.secure_url, // store cloudinary URL
      buttonText,
      buttonLink,
    });

    return res.status(201).json({
      success: true,
      message: "Slide added Successfully",
      slide
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// GET ALL SLIDES
export const getSlides = async (req, res) => {
  try {
    const slides = await HeroCarousel.find().sort({ createdAt: -1 });

    return res.status(201).json({
      success: true,
      slides
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// UPDATE SLIDE (OPTIONAL IMAGE UPDATE)
export const updateSlide = async (req, res) => {
  try {
    const { buttonText, buttonLink } = req.body;

    let updatedData = {
      buttonText,
      buttonLink,
    };

    // if new image uploaded
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      updatedData.image = result.secure_url;
    }

    const slide = await HeroCarousel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Slide Updated Successfully",
      slide
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// DELETE SLIDE
export const deleteSlide = async (req, res) => {
  try {
    await HeroCarousel.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Slide Deleted Successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};