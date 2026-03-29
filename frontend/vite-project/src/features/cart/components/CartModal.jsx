import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ShoppingBag } from "lucide-react";
import { closeCartModal } from "../cartSlice";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { updateQuantityAsync, removeItemAsync } from "../cartSlice"; // Use Thunks
import { getOrCreateGuestId } from "../../../utils/guestId"; // Import Utility

const CartModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isModalOpen, items, totalPrice } = useSelector((state) => state.cart);

  if (!isModalOpen) return null;

  //update quantity
  const handleUpdateQuantity = (id, type) => {
    try {
      const guestId = getOrCreateGuestId();
      // Dispatch the thunk with the required payload
      dispatch(updateQuantityAsync({ productId: id, type, guestId }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  //remove item
  const handleRemove = async (id) => {
    try {
      const guestId = getOrCreateGuestId();
      // Dispatch the thunk with the required payload
      dispatch(removeItemAsync({ productId: id, guestId }));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  //view cart
  const handleViewCart = () => {
    dispatch(closeCartModal());
    navigate("/cart");
  };

  const handleCheckoutNavigation = () => {
    dispatch(closeCartModal()); // Close the drawer first
    navigate("/checkout"); // Then move to checkout
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Black Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => dispatch(closeCartModal())}
      />

      {/* The Sidebar Content */}
      <div className="relative w-full max-w-md bg-[#FDFBF9] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#7A3E3E]" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Shopping Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCartModal())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {items.length > 0 ? (
            items.map((item) => (
              <CartItem
               // Use the product ID if it exists, otherwise fallback to the item's unique _id or index
                key={item.productId?._id || item._id || index}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-lg font-medium">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-[#7A3E3E]">
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                className="w-full bg-[#7A3E3E] text-white py-4 rounded-xl font-bold hover:bg-[#5f2f2f] transition-all shadow-lg shadow-[#7A3E3E]/20"
                onClick={handleCheckoutNavigation}
              >
                Checkout Now
              </button>
              <button
                onClick={handleViewCart}
                className="w-full bg-transparent border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
