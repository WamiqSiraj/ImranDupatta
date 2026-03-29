import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add these
import { loginAsync } from "../authSlice"; // Import thunk
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrCreateGuestId } from "../../../../utils/guestId.js"; // Import utility

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { loading } = useSelector((state) => state.auth); // Get loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the guestId to send for cart merging
    const guestId = getOrCreateGuestId();

    try {
      // Use the Redux thunk instead of direct service call
      const resultAction = await dispatch(loginAsync({ ...credentials, guestId }));

      if (loginAsync.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        toast.success("Login Successful");

        if (user.role === "admin") {
          navigate("/admin/products");
        } else {
          navigate("/");
        }
      } else {
        // If the thunk was rejected (e.g., wrong password)
        toast.error(resultAction.payload || "Login Failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <Link className="inline-block mb-4 px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm hover:bg-amber-200 transition" to={"/"}>
        ← Back to Home
      </Link>
      
      <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="name@example.com"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="••••••••"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </div>
        
        <button 
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition active:scale-[0.98] disabled:bg-gray-400"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default LoginForm;