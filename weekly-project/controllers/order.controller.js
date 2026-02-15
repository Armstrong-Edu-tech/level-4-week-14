const Order = require("../models/order.model");
const sendOrderConfirmationEmail = require("../utils/email.utils");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const email = req.user.email;
        const customerName = req.user.name;

        let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: "pm_card_visa"
            });
        }
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        const items = JSON.parse(paymentIntent.metadata.items);
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const order = await Order.create({
            userEmail: email,
            products: items.map(i => ({ product: i.productId, quantity: i.quantity })),
            total,
            paymentIntentId,
            status: "completed"
        });

        try {
            await sendOrderConfirmationEmail({
                to: email,
                customerName,
                orderId: order._id,
                products: items,
                total
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }
        res.json({ message: "Order confirmed and email sent", order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createOrder };