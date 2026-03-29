import Cart from "../models/cartSchema.js"
import Product from "../models/productSchema.js"

const getCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { guestId } = req.query;

        if (!userId && !guestId) {
            return res.status(200).json({ success: true, data: { items: [], totalPrice: 0 } });
        }

        let cart = await Cart.findOne({
            $or: [
                { userId: userId || null },
                { guestId: userId ? null : guestId }
            ]
        }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({ success: true, data: { items: [], totalPrice: 0 } });
        }

        // --- CLEANUP LOGIC ---
        // Remove items where productId is null (product was deleted from store)
        const initialCount = cart.items.length;
        cart.items = cart.items.filter(item => item.productId !== null);

        // If items were removed, recalculate total and save
        if (cart.items.length !== initialCount) {
            cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            await cart.save();
        }

        return res.status(200).json({ success: true, data: cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId, quantity = 1, guestId } = req.body;

        if (!userId && !guestId) {
            return res.status(400).json({ success: false, message: "Identification required" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        let cart = await Cart.findOne({
            $or: [{ userId }, { guestId }]
        });

        if (!cart) {
            cart = new Cart({
                userId: userId || null,
                guestId: userId ? null : guestId,
                items: [{ productId, quantity, price: product.productPrice }],
                totalPrice: product.productPrice * quantity
            });
        } else {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, price: product.productPrice });
            }
            cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        }

        await cart.save();

        // Populate and filter
        const finalCart = await Cart.findById(cart._id).populate("items.productId");
        finalCart.items = finalCart.items.filter(item => item.productId !== null);

        res.status(200).json({ success: true, cart: finalCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId })
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

        const item = cart.items.find(item => item.productId.toString() === productId)
        if (!item) return res.status(404).json({ success: false, message: "Item not found" })
        if (type === "increase") item.quantity += 1
        if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        await cart.save()
        cart = await cart.populate("items.productId")

        res.status(200).json({ success: true, cart })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId } = req.params; // From URL
        const { guestId } = req.body;     // From Body

        // Find cart by User OR Guest
        let cart = await Cart.findOne({
            $or: [
                { userId: userId || null },
                { guestId: userId ? null : guestId }
            ]
        });

        if (!cart) return res.status(404).json({
            success: false,
            message: "Cart not found"
        });

        // Filter out the item
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Recalculate price
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();

        // Populate to keep the UI updated
        const updatedCart = await cart.populate("items.productId");

        res.status(200).json({
            success: true,
            cart: updatedCart
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const mergeCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { guestId } = req.body;

        if (!guestId) return res.status(400).json({ message: "Guest ID missing" });

        const guestCart = await Cart.findOne({ guestId });
        if (!guestCart) return res.status(200).json({ message: "No guest cart to merge" });

        let userCart = await Cart.findOne({ userId });

        if (!userCart) {
            // Transfer guest cart to user
            guestCart.userId = userId;
            guestCart.guestId = null;
            await guestCart.save();
        } else {
            // Merge items from guest cart to user cart
            guestCart.items.forEach(gItem => {
                const existingItem = userCart.items.find(uItem =>
                    uItem.productId.toString() === gItem.productId.toString()
                );

                if (existingItem) {
                    existingItem.quantity += gItem.quantity;
                } else {
                    userCart.items.push(gItem);
                }
            });

            userCart.totalPrice = userCart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await userCart.save();
            await Cart.findByIdAndDelete(guestCart._id); // Delete old guest cart
        }

        res.status(200).json({ success: true, message: "Carts merged successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    mergeCart
}