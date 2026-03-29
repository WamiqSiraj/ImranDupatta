import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkoutService } from '../services/checkoutService';
import { fetchCartItems } from '../../cart/cartSlice';
import { getOrCreateGuestId } from '../../../utils/guestId'; // Use your utility
import { ChevronLeft, Truck, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get both cart data and auth data
  const { items, totalPrice, loading: cartLoading } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

// 1. AUTO-FILL LOGIC: If user is logged in, fill the form
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullname || '',
        email: user.email || '',
        city: user.city || '',
        address: user.address || ''
      }));
    }
  }, [isAuthenticated, user]);


  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/cart');
    }
  }, [items, cartLoading, navigate]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check for empty cart
    if (items.length === 0) {
      alert("Your cart is empty. Redirecting to shopping...");
      return navigate('/');
    }
    try {
      setIsSubmitting(true);
      
      // Clean mapping of items
      const formattedItems = items.map(item => ({
        productId: item.productId?._id || item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        shippingDetails: formData,
        items: formattedItems,
        totalAmount: totalPrice + 200, // Subtotal + Shipping
        guestId: getOrCreateGuestId()  // Use the utility helper
      };

      const result = await checkoutService.placeOrder(orderData);
      
      if (result.success) {
        // Clear the cart in Redux state
        await dispatch(fetchCartItems());
        toast.success(`Order #${result.order.orderNumber} placed successfully!`);
        navigate('/order-success', { state: { order: result.order } }); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] py-12">
      <div className="container mx-auto px-7 max-w-6x1">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: Shipping Details */}
          <div className="space-y-8">
            <div>
              <button 
                type="button" // Important to prevent form submission
                onClick={() => navigate('/cart')} 
                className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors"
              >
                <ChevronLeft size={18} /> Back to Cart
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck className="text-[#7A3E3E]" size={20} /> Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInput} className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#7A3E3E]/20" />
                <input required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInput} className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#7A3E3E]/20" />
                <input required name="phone" placeholder="Phone Number (e.g. 0300...)" value={formData.phone} onChange={handleInput} className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#7A3E3E]/20 md:col-span-2" />
                <input required name="address" placeholder="Complete House Address" value={formData.address} onChange={handleInput} className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#7A3E3E]/20 md:col-span-2" />
                <input required name="city" placeholder="City" value={formData.city} onChange={handleInput} className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#7A3E3E]/20" />
                <input name="postalCode" placeholder="Postal Code (Optional)" value={formData.postalCode} onChange={handleInput} className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#7A3E3E]/20" />
              </div>
            </div>

            {/* Payment Method Section (COD) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="text-[#7A3E3E]" size={20} /> Payment Method
              </h2>
              <div className="p-4 border-2 border-[#7A3E3E] bg-[#7A3E3E]/5 rounded-xl flex items-center justify-between">
                <span className="font-bold text-[#7A3E3E]">Cash on Delivery (COD)</span>
                <div className="w-5 h-5 rounded-full bg-[#7A3E3E] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div key={item.productId?._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.productId?.productImg?.[0]?.url || item.productId?.productImg?.[0]} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                        {item.productId?.productName || "Product Unavailable"}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>Rs. 200</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-[#7A3E3E]">Rs. {(totalPrice + 200).toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#7A3E3E] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#5f2f2f] transition-all shadow-xl shadow-[#7A3E3E]/20 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Placing Order...
                  </>
                ) : (
                  "Confirm & Place Order"
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} /> 100% Secure Checkout & Guaranteed Quality
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;