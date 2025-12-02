const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// --- Gmail transporter with App Password ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourgmail@gmail.com',       // Replace with your Gmail
        pass: 'yourapppassword',          // Replace with Gmail App Password
    },
});

// --- In-memory store for demo purposes ---
const users = {
    "student@example.com": { password: "123456", resetToken: null, tokenExpiry: null }   // Replace with your Gmail
};

// --- Function to send reset password email ---
function sendResetEmail(email, token) {
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
        from: 'yourgmail@gmail.com',    // Replace with your Gmail
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Hello,</p>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error('Error sending email:', err);
        else console.log('Reset email sent:', info.response);
    });
}

// --- Route to request password reset ---
app.post('/request-reset', (req, res) => {
    const { email } = req.body;
    const user = users[email];
    if (!user) return res.status(404).send('User not found');

    const token = crypto.randomBytes(20).toString('hex');
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetToken = token;
    user.tokenExpiry = expiry;

    sendResetEmail(email, token);

    res.send('Password reset email sent!');
});

// --- Route to reset password ---
app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find user by token
    const user = Object.values(users).find(u => u.resetToken === token && u.tokenExpiry > Date.now());
    if (!user) return res.status(400).send('Invalid or expired token');

    // Update password and clear token
    user.password = newPassword;
    user.resetToken = null;
    user.tokenExpiry = null;

    res.send('Password has been reset successfully!');
});

// --- Start server ---
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
