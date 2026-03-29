import Order from '../models/orderSchema.js';
import Cart from '../models/cartSchema.js';
import { v4 as uuidv4 } from 'uuid'; // For generating order numbers
// --- USER LOGIC ---
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { shippingDetails, items, totalAmount, guestId } = req.body;

        // 1. Validation
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        // 2. Create unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Initialize Order with Guest/User logic
        const newOrder = new Order({
            userId: userId || null, // Link to user if logged in
            guestId: userId ? null : guestId, // Link to guestId ONLY if not logged in
            items,
            shippingDetails,
            totalAmount,
            orderNumber,
            paymentMethod: 'Cash on Delivery'
        });

        await newOrder.save();

        // --- EMAIL LOGIC (extra) ---
        const orderDetails = newOrder.items.map(item =>
            `<li>${item.quantity}x Product ID: ${item.productId} - Rs. ${item.price}</li>`
        ).join('');

        const emailMessage = `
            <h1>Thank you for your order!</h1>
            <p>Hi ${newOrder.shippingDetails.fullName},</p>
            <p>Your order <strong>${newOrder.orderNumber}</strong> has been confirmed.</p>
            <h3>Order Summary:</h3>
            <ul>${orderDetails}</ul>
            <p><strong>Total Amount: Rs. ${newOrder.totalAmount}</strong></p>
            <p>Delivery to: ${newOrder.shippingDetails.address}, ${newOrder.shippingDetails.city}</p>
        `;
        try {
            await sendEmail({
                email: newOrder.shippingDetails.email,
                subject: `Order Confirmed - ${newOrder.orderNumber}`,
                message: emailMessage,
            });
        } catch (err) {
            console.log("--- NODEMAILER ERROR ---");
            console.error("Email failed to send, but order was placed." || err) ;
        }


        // 4. SMART CART CLEARING
        // We clear based on the identifier that was actually used
        if (userId) {
            await Cart.findOneAndDelete({ userId });
        } else if (guestId) {
            await Cart.findOneAndDelete({ guestId });
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder
        });

    } catch (error) {
        console.error("BACKEND ORDER ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message
        });
    }
};
// --- ADMIN LOGIC ---
// Get all orders for Admin Dashboard
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            // Populate user info AND product info inside the items array
            .populate('userId', 'name email')
            .populate('items.productId', 'productName productImg');

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order Status (Pending -> Shipped -> etc)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};