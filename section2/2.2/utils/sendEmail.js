const nodemailer = require("nodemailer");

const transporterAppPassword = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your.email@gmail.com",
        pass: "your-app-password",
    },
});

const transporterOAuth2 = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "your.email@gmail.com",
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        refreshToken: "YOUR_REFRESH_TOKEN",
        accessToken: "YOUR_ACCESS_TOKEN",
    },
});

const sendEmail = ({ to, subject, text, method }) => {
    let transporter;
    if (method === "oauth2") {
        transporter = transporterOAuth2;
    } else {
        transporter = transporterAppPassword;
    }

    const mailOptions = {
        from: "your.email@gmail.com",
        to,
        subject,
        text: text || "Default text content",
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;