const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// Mock database (example)
let users = [
    {
        email: "student@example.com",    // <--- Replace with your Gmail
        password: "123456",
        resetToken: null,
        resetTokenExpire: null,
    },
];

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yourgmail@gmail.com",     // <--- Replace with your Gmail
        pass: "yourapppassword",         // <--- Replace with App Password
    },
});

// Function to send reset password email 
function sendResetEmail(email, token) {
    const resetURL = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
        from: "yourgmail@gmail.com",     // <--- Replace with your Gmail
        to: email,
        subject: "Password Reset Request",
        html: `
            <h3>Password Reset Request</h3>
            <p>Click the button below to reset your password:</p>
            <a href="${resetURL}" style="
                background:#007bff;
                color:#fff;
                padding:10px 20px;
                text-decoration:none;
                border-radius:5px;">
                Reset Password
            </a>
            <p>This link will expire in 15 minutes.</p>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error('Error sending email:', err);
        else console.log('Reset email sent:', info.response);
    });
}

// Request Reset Password Route
app.post("/request-reset", (req, res) => {
    const userEmail = req.body.email;
    const user = users.find((u) => u.email === userEmail);

    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    // Generate a unique token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    sendResetEmail(userEmail, resetToken);

    res.json({ message: "Password reset email sent!" });
});

// Validate Token & Reset Password Route
app.post("/reset-password/:token", (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = users.find(
        (u) => u.resetToken === token && u.resetTokenExpire > Date.now()
    );

    if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;

    res.json({ message: "Password updated successfully!" });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
