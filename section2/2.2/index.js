const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

//  METHOD 1 — Gmail App Password
const transporterAppPassword = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your.email@gmail.com",       // Replace with your Gmail
        pass: "your-app-password"           // Replace with Gmail App Password
    }
});

//  METHOD 2 — Gmail OAuth2 with Auto Access Token
const transporterOAuth2 = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "your.email@gmail.com",       // Replace with your Gmail
        clientId: "YOUR_CLIENT_ID",         // Replace with your OAuth2 Client ID
        clientSecret: "YOUR_CLIENT_SECRET", // Replace with your OAuth2 Client Secret
        refreshToken: "YOUR_REFRESH_TOKEN", // Replace with your Refresh Token
        accessToken: "YOUR_ACCESS_TOKEN"    // Replace with your Access Token
    }
});

//  SEND EMAIL FUNCTION
const sendEmail = (req, res) => {
    const { to, subject, text, method } = req.body;

    const mailOptions = {
        from: 'your.email@gmail.com',       
        to,                  
        subject,                          
        text: text || 'Default text content',
    };

    // Choose transporter based on the method: 'oauth2' or 'app'
    const transporter = method === 'oauth2' ? transporterOAuth2 : transporterAppPassword;

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');      
        }
    });
}

//  EXPRESS ROUTE
app.post("/send-email", sendEmail);

//  START SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
