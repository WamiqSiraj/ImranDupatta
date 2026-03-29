import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  // If someone tries to visit /order-success directly without an order, redirect home
  if (!order) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="text-green-600" size={48} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for shopping with us. We've sent a confirmation email to 
          <span className="font-semibold text-gray-800"> {order.shippingDetails.email}</span>.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Order Number</span>
            <span className="font-bold text-gray-900">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Total Paid</span>
            <span className="font-bold text-[#7A3E3E]">Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            to="/" 
            className="w-full bg-[#7A3E3E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#5f2f2f] transition-all"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>
          <Link 
            to="/my-orders" 
            className="w-full flex items-center justify-center gap-2 text-gray-500 font-semibold hover:text-black transition-colors"
          >
            View Order Status <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;