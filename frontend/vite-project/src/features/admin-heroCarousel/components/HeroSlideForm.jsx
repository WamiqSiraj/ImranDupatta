import React, { useState } from "react";

const HeroSlideForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    buttonText: "",
    buttonLink: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    formData.append("image", image);

    onSubmit(formData);

    // reset
    setForm({ buttonText: "", buttonLink: "" });
    setImage(null);
    setPreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg space-y-4">

      <h2 className="text-xl font-bold">Add New Slide</h2>

      <input
        type="text"
        name="buttonText"
        placeholder="Button Text"
        value={form.buttonText}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="buttonLink"
        placeholder="Button Link"
        value={form.buttonLink}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input type="file" onChange={handleImage} required />

      {/* 🔥 Preview */}
      {preview && (
        <img src={preview} alt="preview" className="w-full h-40 object-cover rounded" />
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Slide
      </button>

    </form>
  );
};

export default HeroSlideForm;