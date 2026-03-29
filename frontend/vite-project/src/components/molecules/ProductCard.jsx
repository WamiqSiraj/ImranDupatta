import React, { useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2, ShoppingBag } from "lucide-react"; // Added missing icons
import { fetchCartItems, addToCartAsync ,toggleCartModal } from "../../features/cart/cartSlice";
import { getOrCreateGuestId } from "../../utils/guestId";
import {toast} from "react-toastify"

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleNavigate = () => {
    // No need to check for BUTTON here because of e.stopPropagation() below
    navigate(`/product/${product._id}`);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      const guestId = getOrCreateGuestId();
      // 4. Dispatch the async thunk with the data object
      // This sends everything (ID, qty, guestId) to the backend in one go
      const resultAction = await dispatch(
        addToCartAsync({
          productId: product._id,
          quantity: quantity,
          guestId: guestId,
        }),
      );

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
      alert("Failed to add to cart. Are you logged in?");
    } finally {
      setIsAdding(false);
    }
  };

  // const handleAddToCart = async () => {
  //     try {
  //       setIsAdding(true);

  //       // 3. Get the guestId (or use the existing one)
  //       const guestId = getOrCreateGuestId();

  //       // 4. Dispatch the async thunk with the data object
  //       // This sends everything (ID, qty, guestId) to the backend in one go
  //       const resultAction = await dispatch(addToCartAsync({
  //         productId: product._id,
  //         quantity: quantity,
  //         guestId: guestId
  //       }));

  //       // 5. Check if the action was successful
  //       if (addToCartAsync.fulfilled.match(resultAction)) {
  //         dispatch(toggleCartModal());
  //         setQuantity(1);
  //         toast.success("Added to cart!");
  //       } else {
  //         toast.error(resultAction.payload || "Failed to add to cart");
  //       }
  //     } catch (error) {
  //       console.error("Cart error:", error);
  //       toast.error("Something went wrong");
  //     } finally {
  //       setIsAdding(false);
  //     }
  //   };
  return (
    <div onClick={handleNavigate} className="group cursor-pointer">
      <div className="relative aspect-[3/4] mb-3 flex items-center justify-center overflow-hidden">
        {/* Collection Badge */}
        {product.productCollection && (
          <span className="absolute top-3 left-3 bg-[#7A3E3E] text-white text-[10px] px-2 py-1 uppercase z-10 rounded-sm">
            {product.productCollection}
          </span>
        )}

        <img
          src={product.productImg?.[0]?.url || product.productImg?.[0]}
          alt={product.productName}
          className="object-cover w-full h-full rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 truncate">
          {product.productName}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
          {product.productDescription}
        </p>

        <div className="flex flex-col gap-2 mt-2">
          <p className="text-[#7A3E3E] font-bold text-xl">
            Rs. {product.productPrice?.toLocaleString()}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Essential: Prevents navigation to product page
              handleAddToCart();
            }}
            disabled={isAdding}
            className="w-full bg-[#7A3E3E] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#5f2f2f] transition-all shadow-lg shadow-[#7A3E3E]/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isAdding ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <ShoppingBag size={18} />
                <span className="text-sm">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
