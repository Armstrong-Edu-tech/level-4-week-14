const express = require("express");
const sendEmail = require("./utils/sendEmail");

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
    const { to, subject, text, method } = req.body;
    try {
        await sendEmail({ to, subject, text, method });
        res.send("Email sent successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sending email");
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});