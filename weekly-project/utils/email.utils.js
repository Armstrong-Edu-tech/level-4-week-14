const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOrderConfirmationEmail = async ({ to, customerName, orderId, products, total }) => {
    const htmlContent = `
    <html>
    <head>
        <!-- Bootstrap CDN -->
        <link rel="stylesheet" 
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

        <style>
            body {
                background-color: #f8f9fa;
                margin: 0;
                font-family: Arial, sans-serif;
            }

            .email-container {
                background-color: #ffffff;
                border-radius: 12px;
                border: 1px solid #e0e0e0;
                padding: 25px;
                max-width: 650px;
                margin: 25px auto;
            }

            h2 {
                font-weight: 600;
            }

            .highlight {
                color: #0d6efd;
                font-weight: 600;
                text-decoration: none;
            }

            p {
                color: #212529;
                font-size: 15px;
                line-height: 1.6;
            }

            table {
                width: 100%;
                margin-top: 20px;
                border-collapse: separate;
                border-spacing: 0;
                font-size: 15px;
            }

            thead tr {
                background-color: #0d6efd;
                color: #ffffff;
            }

            th {
                padding: 12px 10px;
                border: none;
                font-weight: 500;
                text-align: left;
            }

            td {
                padding: 12px 10px;
                border-bottom: 1px solid #e5e5e5;
                color: #212529;
            }

            td:last-child,
            th:last-child {
                text-align: right;
            }

            tbody tr:last-child td {
                font-weight: bold;
                background-color: #eaf3ff;
                border-bottom: none;
            }

            tbody tr:hover td {
                background-color: #f6f9ff;
            }

            .footer {
                font-size: 13px;
                color: #6c757d;
                margin-top: 20px;
            }
        </style>
    </head>

    <body>
        <div class="email-container shadow-sm">

            <h2 class="text-primary">
                Thank you for your order, 
                <span class="highlight">${customerName}</span>!
            </h2>

            <p>
                Your order 
                <strong class="text-primary">#${orderId}</strong> 
                has been confirmed successfully.
            </p>

            <h5 class="text-primary mt-4 mb-2">Order Details</h5>

            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="width: 80px;">Qty</th>
                        <th style="width: 100px;">Price</th>
                    </tr>
                </thead>

                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.quantity}</td>
                            <td>$${p.price}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="2">Total</td>
                        <td>$${total}</td>
                    </tr>
                </tbody>
            </table>

            <p class="mt-4">
                If you have any questions, feel free to reply to this email.
            </p>

            <p class="footer">Thank you for shopping with us ❤️</p>

        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: `Order Confirmation #${orderId}`,
        html: htmlContent
    });
};

module.exports = sendOrderConfirmationEmail