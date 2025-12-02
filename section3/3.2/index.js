const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// Initialize Stripe with secret key
const Stripe = require("stripe");          // Import the Stripe library
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Initialize with secret key

// Function: Create Payment Intent
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

// --------- ROUTES ---------
app.post("/create-payment-intent", createPaymentIntent);

// --------- SERVER ---------
app.listen(3000, () => {
    console.log("Server running on port 3000...");
});