const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendResetEmail = ({ email, token }) => {
    const resetURL = `http://localhost:3000/reset-password/${token}`;
    
    const mailOptions = {
        from: process.env.GMAIL_USER,
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

    return transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;