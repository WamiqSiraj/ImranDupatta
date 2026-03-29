import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../components/CartItem";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateQuantityAsync, removeItemAsync } from "../cartSlice";
import { getOrCreateGuestId } from "../../../utils/guestId";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (id, type) => {
    try {
      const guestId = getOrCreateGuestId();
      dispatch(updateQuantityAsync({ productId: id, type, guestId }));
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const guestId = getOrCreateGuestId();
      dispatch(removeItemAsync({ productId: id, guestId }));
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Updating Cart...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFBF9] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.length > 0 ? (
              items.map((item) => (
                <CartItem
                  key={item.productId._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">
                  Your cart is currently empty.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 text-[#7A3E3E] font-bold underline"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#7A3E3E]">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-[#7A3E3E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#5f2f2f] transition-all"
                onClick={() => navigate("/checkout")}
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
