const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const createPaymentIntent = require("./controllers/payment.controller");

const app = express();
app.use(express.json());

app.post("/create-payment-intent", createPaymentIntent);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});