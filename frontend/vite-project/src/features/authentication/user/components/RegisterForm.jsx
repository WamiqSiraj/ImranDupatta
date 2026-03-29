import React, { useState } from "react";
import { getOrCreateGuestId } from "../../../../utils/guestId.js"; // Import our utility
import { useDispatch } from "react-redux";
import { registerAsync } from "../authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const RegisterForm = ({ setLoader }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    city: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guestId = getOrCreateGuestId();
    const payload = { ...formData, guestId };

    const resultAction = await dispatch(registerAsync(payload));
   console.log(resultAction);
   
    if (registerAsync.fulfilled.match(resultAction)) {
      toast.success("Registration Successful!");
      navigate("/");
    } else {
      toast.error(resultAction.payload || "Registration Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h2 className="col-span-2 text-xl font-bold text-gray-800 mb-2">
        Create Account
      </h2>

      <input
        name="fullname"
        placeholder="Full Name"
        onChange={handleChange}
        className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        name="address"
        placeholder="Complete Shipping Address"
        onChange={handleChange}
        className="border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 col-span-2 min-h-[100px]"
        required
      />

      <button
        type="submit"
        className="col-span-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
      >
        Create Account & Join
      </button>
    </form>
  );
};
