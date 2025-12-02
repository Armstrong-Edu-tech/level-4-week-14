const express = require('express');
const nodemailer = require('nodemailer');

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

// --- Function to send HTML email ---
const sendEmail = (req, res) => {
    const { to, name } = req.body; // name of the recipient

    const htmlContent = `
    <html>
    <head>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background-color: #0A192F; 
                padding: 20px; 
                color: #E0E0E0;
            }
            .container { 
                background-color: #112240; 
                padding: 20px; 
                border-radius: 12px; 
                border: 2px solid #64FFDA; 
            }
            h1 { 
                color: #64FFDA; 
            }
            p { 
                font-size: 16px; 
                color: #CCD6F6; 
            }
            .highlight { 
                color: #FF5370; 
                font-weight: bold; 
            }
            a { 
                color: #64FFDA; 
                text-decoration: none; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello <span class="highlight">${name}</span>!</h1>
            <p>This email was sent to you using <strong>Nodemailer</strong> with DECI-themed styling.</p>
            <p>We hope you enjoy the colors and design aligned with DECI!</p>
        </div>
    </body>
    </html>
`;

    const mailOptions = {
        from: 'yourgmail@gmail.com',      // Replace with your Gmail
        to,
        subject: 'DECI-Themed HTML Email',
        html: htmlContent,
        attachments: [
            {
                filename: 'image.png',         // Name of the file in email
                path: 'image.png',     // Path to the file on your server
            },
        ]
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ success: false, error: err.message });
        }
        console.log('Email sent:', info.response);
        res.json({ success: true, message: 'Email sent successfully', info: info.response });
    });
};

// --- Express route ---
app.post('/send-email', sendEmail);

// --- Start server ---
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
