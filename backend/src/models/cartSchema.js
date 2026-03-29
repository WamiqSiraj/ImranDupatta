import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        unique: false
    },
    guestId: { 
        type: String, 
        index: true // Faster searching for guest carts
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

// We should ensure a caart has EITHER a userId or a guestId
cartSchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });
const Cart = mongoose.model('Cart', cartSchema)
export default Cart;

