const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

const sendResetEmail = ({email, token}) => {
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Hello,</p>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail
