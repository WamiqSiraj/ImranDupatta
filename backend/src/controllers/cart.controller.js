import Cart from "../models/cartSchema.js"
import Product from "../models/productSchema.js"

const getCart = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await Cart.findById(userId).populate("items.productId")
        if (!cart) {
            return res.json({
                success: true,
                message: "Cart is Empty",
                cart: []
            })
        }
        return res.status(200).json({
            success: true,
            data: cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        // check if product exists
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // find the user's cart (if exists)
        let cart = await Cart.findOne({ userId })

        // If cart doesn't exists, create a new one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            })
        } else {
            // Find if product is already in the cart
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            )

            if (itemIndex > -1) {
                // if product exists -> just increase quantity
                cart.items[itemIndex].quantity += 1
            } else {
                // if new product -> push to cart
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice,
                })
            }

            // Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )
        }

        // Save updated cart
        await cart.save()

        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId")

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

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
        const userId = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({
            success: false,
            message: "Cart not found"
        })

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        await cart.save()
        res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart
}