const Stripe = require("stripe");
const Product = require("../models/product.model");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { items, email, currency = "usd" } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }
        const productsWithDetails = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) throw new Error(`Product not found: ${item.product}`);
                return {
                    productId: product._id,
                    name: product.name,
                    quantity: item.quantity,
                    price: product.price
                };
            })
        );

        const amount = productsWithDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const intent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata: { email, items: JSON.stringify(productsWithDetails) },
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        });
        res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id,
            items: productsWithDetails, total: amount });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createPaymentIntent };