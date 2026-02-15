const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendEmail = ({ to, name }) => {
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
        from: process.env.GMAIL_USER,
        to,
        subject: "DECI-Themed HTML Email",
        html: htmlContent,
        attachments: [
            {
                filename: "image.png",
                path: "image.png",
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;