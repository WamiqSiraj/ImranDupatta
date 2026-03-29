import React from 'react';
import { RegisterForm } from '../components/RegisterForm.jsx';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-amber-300 flex items-center justify-center p-6">
            <div className="bg-amber-200 shadow-xl rounded-2xl p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h1>
                <RegisterForm />
                <p className="mt-4 text-center">
                    Already have an account? <a href="/user/login" className="text-blue-500 font-semibold">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;