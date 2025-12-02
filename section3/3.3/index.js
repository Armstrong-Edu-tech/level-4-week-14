// Step 1: Setup & Dependencies
const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// Step 3: Initialize Stripe using Secret Key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Step 4: Controller Function
async function createPaymentIntent(req, res) {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency
        });

        return res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Step 5: Route
app.post("/create-payment-intent", createPaymentIntent);

// Step 6: Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
