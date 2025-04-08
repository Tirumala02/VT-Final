const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


router.post('/send-email', async (req, res) => {
    const { orderData } = req.body;

    if (!orderData || !orderData.email) {
        return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Define email content
    const { address, items, amount } = orderData;
    const customerEmail = orderData.email;
    const adminEmail = "anub0709@gmail.com"; // Replace with actual admin email

    // Order Summary HTML Template
    const emailTemplate = `
    <html>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Thank You for Your Order!</h2>
            <p>Hello <strong>${address.firstName} ${address.lastName}</strong>,</p>
            <p>We have received your order and it is now being processed. Here are your order details:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 10px;">Item</th>
                        <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Quantity</th>
                        <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 10px;">${item.name} (${item.size})</td>
                        <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${item.quantity}</td>
                        <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>

            <h3 style="text-align: right; color: #333;">Total: $${amount.toFixed(2)}</h3>

            <h4>Shipping Address:</h4>
            <p>${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>

            <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
            
            <p style="text-align: center; color: #777;">Thank you for shopping with us!</p>
        </div>
    </body>
    </html>
    `;

    try {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS  // Your Gmail App Password
            }
        });

        // Send email to customer
        await transporter.sendMail({
            from: `"Shop Name" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: "Your Order Confirmation",
            html: emailTemplate
        });

        // Send email to admin
        await transporter.sendMail({
            from: `"Shop Name" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: "New Order Received",
            html: emailTemplate
        });

        res.status(200).json({ success: true, message: "Email sent successfully" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

module.exports = router;
