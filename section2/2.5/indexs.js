const express = require("express");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const sendResetEmail = require("./utils/sendEmail");

const app = express();
app.use(express.json());

const users = {
    "student@example.com": {   // <--- Replace with your Gmail
        password: "123456",
        resetToken: null,
        tokenExpiry: null,
    },
};

app.post("/request-reset", async (req, res) => {
    const { email } = req.body;
    try {
        const user = users[email];
        if (!user) return res.status(404).send("User not found");

        const token = crypto.randomBytes(20).toString("hex");
        const expiry = Date.now() + 15 * 60 * 1000;

        user.resetToken = token;
        user.tokenExpiry = expiry;

        await sendResetEmail({ email, token });

        res.status(200).json({ message: "Password reset email sent!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/reset-password/:token", (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = Object.values(users).find(
            (u) => u.resetToken === token && u.tokenExpiry > Date.now()
        );
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        user.password = newPassword;
        user.resetToken = null;
        user.tokenExpiry = null;

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully!",
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});