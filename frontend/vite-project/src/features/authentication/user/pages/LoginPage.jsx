import React from "react";
import LoginForm from "../components/LoginForm.jsx";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-300 p-4">
      <div className="max-w-md w-full bg-amber-200 rounded-xl shadow-lg p-6 sm:p-8 flex items-center flex-col">
        {/* Responsive Image Container */}
        <div className="w-full max-w-[160px] mb-3">
          <img
            className="rounded-2xl w-full h-auto object-cover shadow-sm"
            src="/temp/Shop Logo.jpeg"
            alt="Shop Logo"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-amber-900">User Login</h2>
        
        {/* Ensure the form takes up the full width of its container */}
        <div className="w-full">
          <LoginForm />
        </div>

        <p className="mt-3 text-center text-sm text-amber-800">
          Don't have an account?{" "}
          <a href="/user/register" className="text-blue-700 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;