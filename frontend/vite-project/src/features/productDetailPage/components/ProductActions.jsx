import React, { useState } from "react";
import { Heart, ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
// 1. Import the Thunk instead of the raw service
import { addToCartAsync, toggleCartModal } from "../../cart/cartSlice";
// 2. Import the guestId utility
import { getOrCreateGuestId } from "../../../utils/guestId"; 
import { toast } from "react-toastify";

const ProductActions = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      
      // 3. Get the guestId (or use the existing one)
      const guestId = getOrCreateGuestId();

      // 4. Dispatch the async thunk with the data object
      // This sends everything (ID, qty, guestId) to the backend in one go
      const resultAction = await dispatch(addToCartAsync({ 
        productId: product._id, 
        quantity: quantity, 
        guestId: guestId 
      }));

      // 5. Check if the action was successful
      if (addToCartAsync.fulfilled.match(resultAction)) {
        dispatch(toggleCartModal());
        setQuantity(1); 
        toast.success("Added to cart!");
      } else {
        toast.error(resultAction.payload || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8 pt-8 border-t border-gray-100">
      <div className="flex items-center gap-6">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-200 rounded-xl px-2 py-1 bg-white">
          <button
            type="button"
            disabled={isAdding}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Minus size={18} />
          </button>

          <span className="w-12 text-center font-bold text-lg">{quantity}</span>

          <button
            type="button"
            disabled={isAdding}
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 bg-[#7A3E3E] text-white h-14 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#5f2f2f] transition-all shadow-lg shadow-[#7A3E3E]/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
        >
          {isAdding ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <ShoppingBag size={20} />
              Add to Cart
            </>
          )}
        </button>

        {/* Wishlist Button */}
        <button className="h-14 w-14 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all hover:bg-red-50">
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductActions;