const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency
        });

        return res.status(201).json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = createPaymentIntent;