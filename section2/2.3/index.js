const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = require("./utils/sendEmail");

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
    const { to, name } = req.body;

    try {
        const info = await sendEmail({ to, name });
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
            info: info.response,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(
        "Server running on http://localhost:" + (process.env.PORT || 3000)
    );
});