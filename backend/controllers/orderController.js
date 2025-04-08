// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from 'stripe'
// import razorpay from 'razorpay'
// import nodemailer from 'nodemailer';
// import { v4 as uuidv4 } from 'uuid'; // Ensure you install `uuid` package
// import mongoose from "mongoose";
// import crypto from 'crypto';
// // global variables
// const currency = 'INR'
// const deliveryCharge = 10

// // gateway initialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// const razorpayVal = new razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// const placeOrder = async (req, res) => {
//     try {
//         const { items, amount, address } = req.body; // Remove userId from body
//         const userId = req.userId; // Use from authUser middleware
//         console.log(userId, amount, address);

//         if (!userId) {
//             return res.status(400).json({ success: false, message: "User ID is required" });
//         }

//         let user;
//         if (!userId.startsWith("guest_")) {
//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid User ID" });
//             }
//             user = await userModel.findById(userId);
//         } else {
//             user = await userModel.findOne({ guestId: userId });
//         }

//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         const orderData = {
//             userId: user._id,
//             items,
//             address,
//             amount,
//             paymentMethod: "COD",
//             payment: false,
//             status: "Order Placed",
//             date: Date.now(),
//         };

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         await userModel.findByIdAndUpdate(user._id, { cartData: {} });

//         res.json({ success: true, message: "Order Placed" });
//     } catch (error) {
//         console.error("Place order error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// const placeOrderRazorpay = async (req, res) => {
//     try {
//         const { items, amount, address, currency } = req.body; // Remove userId from body
//         const userId = req.userId; // Use from authUser middleware
//         console.log({ userId, items, amount, address, currency }); // Debugging

//         if (!userId || !items || !amount || !address) {
//             return res.status(400).json({ success: false, message: "Missing required fields" });
//         }

//         let user;
//         if (!userId.startsWith("guest_")) {
//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid User ID" });
//             }
//             user = await userModel.findById(userId);
//         } else {
//             user = await userModel.findOne({ guestId: userId });
//         }

//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         const orderData = {
//             userId: user._id,
//             items,
//             address,
//             amount,
//             paymentMethod: "Razorpay",
//             payment: false,
//             status: "Pending Payment",
//             date: Date.now(),
//         };

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         const options = {
//             amount: Math.round(amount * 100), // Convert to paise
//             currency: currency?.toUpperCase() || "INR",
//             receipt: newOrder._id.toString(),
//         };

//         const razorpayOrder = await razorpayVal.orders.create(options);

//         res.json({
//             success: true,
//             message: "Order initiated with Razorpay",
//             order: {
//                 id: razorpayOrder.id,
//                 amount: razorpayOrder.amount,
//                 currency: razorpayOrder.currency,
//                 receipt: razorpayOrder.receipt,
//             },
//         });
//     } catch (error) {
//         console.error("Razorpay order creation error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// const verifyRazorpay = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//         const userId = req.userId; // Use from authUser middleware
//         console.log("verifyRazorpay - userId:", userId); // Debugging

//         // Validation
//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Missing payment details" });
//         }

//         // Verify payment signature
//         const generatedSignature = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//             .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//             .digest('hex');

//         if (generatedSignature !== razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Invalid payment signature" });
//         }

//         // Fetch order to confirm payment
//         const orderInfo = await razorpayVal.orders.fetch(razorpay_order_id);
//         if (orderInfo.status === 'paid') {
//             await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true, status: "Order Placed" });
//             if (!userId.startsWith("guest_")) {
//                 if (!mongoose.Types.ObjectId.isValid(userId)) {
//                     return res.status(400).json({ success: false, message: "Invalid User ID" });
//                 }
//                 await userModel.findByIdAndUpdate(userId, { cartData: {} });
//             }
//             res.json({ success: true, message: "Payment successful" });
//         } else {
//             res.json({ success: false, message: "Payment not completed" });
//         }
//     } catch (error) {
//         console.error("Razorpay verification error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Send Order Confirmation Email
// const sendEmail = async (req, res) => {
//     const { order,orderData } = req.body;

//     if (!orderData || !orderData.email) {
//         return res.status(400).json({ success: false, message: "Invalid order data" });
//     }

//     const { address, items, amount, paymentMethod } = orderData;
//     const customerEmail = orderData.email;
//     const adminEmail = "anub0709@gmail.com"; // Replace with your admin email

//     // Determine currency symbol
//     const currencySymbol = paymentMethod === "Razorpay" ? "₹" : "₹"; // Adjust based on your needs

//     // Order Summary HTML Template with Payment Method
//     const emailTemplate = `
//     <html>
//     <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
//             <h2 style="color: #333; text-align: center;">Thank You for Your Order!</h2>
//             <p>Hello <strong>${address.firstName} ${address.lastName}</strong>,</p>
//             <p>We have received your order and it is now being processed. Here are your order details:</p>

//             <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                     <tr>
//                         <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 10px;">Item</th>
//                         <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Quantity</th>
//                         <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Price</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${items
//                         .map(
//                             (item) => `
//                     <tr>
//                         <td style="border-bottom: 1px solid #ddd; padding: 10px;">${item.name} (${item.size})</td>
//                         <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${item.quantity}</td>
//                         <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${currencySymbol}${((item.offerPrice || item.price) * item.quantity).toFixed(2)}</td>
//                     </tr>`
//                         )
//                         .join('')}
//                 </tbody>
//             </table>

//             <h3 style="text-align: right; color: #333;">Total: ${currencySymbol}${amount.toFixed(2)}</h3>

//             <h4>Shipping Address:</h4>
//             <p>${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>

//             <h4>Payment Method:</h4>
//             <p>${paymentMethod.toUpperCase()}${paymentMethod === "Razorpay" ? " (Paid)" : paymentMethod === "COD" ? " (Pay on Delivery)" : " (Payment Done ✔️)"}</p>
//             ${
//                 paymentMethod === "Razorpay" && order && order.id ? `
//                 <h4>Razorpay order Id:</h4>
//                 <p>Order ID: ${order.id}</p>
//                 <br/>
//                 <br/>
//                 ` : ''
//             }

//             <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>

//             <p style="text-align: center; color: #777;">Thank you for shopping with us!</p>
//         </div>
//     </body>
//     </html>
//     `;
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         // Send email to customer
//         await transporter.sendMail({
//             from: `"VT Fashions" <${process.env.EMAIL_USER}>`,
//             to: customerEmail,
//             subject: "VT FAS Order Confirmation",
//             html: emailTemplate,
//         });

//         // Send email to admin
//         await transporter.sendMail({
//             from: `"VT Fashions" <${process.env.EMAIL_USER}>`,
//             to: adminEmail,
//             subject: "New Order Received",
//             html: emailTemplate,
//         });

//         res.status(200).json({ success: true, message: "Email sent successfully" });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).json({ success: false, message: "Failed to send email" });
//     }
// };
// // All Orders data for Admin Panel
// const allOrders = async (req,res) => {

//     try {

//         const orders = await orderModel.find({})
//         res.json({success:true,orders})

//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }

// }



// const userOrders = async (req, res) => {
//     try {
//       const userId = req.userId; // Get userId from authUser middleware
//       let user;

//       console.log('Fetching orders for userId:', userId);

//       if (!userId) {
//         return res.status(400).json({ success: false, message: 'User ID is required' });
//       }

//       if (!userId.startsWith('guest_')) {
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//           return res.status(400).json({ success: false, message: 'Invalid User ID' });
//         }
//         user = await userModel.findById(userId);
//       } else {
//         user = await userModel.findOne({ guestId: userId });
//       }

//       if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//       const orders = await orderModel.find({ userId: user._id }).sort({ date: -1 });
//       res.json({ success: true, orders });
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

// // update order status from Admin Panel
// const updateStatus = async (req,res) => {
//     try {

//         const { orderId, status } = req.body

//         await orderModel.findByIdAndUpdate(orderId, { status })
//         res.json({success:true,message:'Status Updated'})

//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// export {verifyRazorpay ,placeOrder,  placeOrderRazorpay, sendEmail, allOrders, userOrders, updateStatus}
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid"; // Ensure `uuid` is installed
import mongoose from "mongoose";
import crypto from "crypto";

// Global variables
const currency = "INR";
const deliveryCharge = 10;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayVal = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place Order (COD)
const placeOrder = async (req, res) => {
  console.log("placeOrder: Request received with body:", req.body);
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("placeOrder: User ID:", userId);

    if (!userId || !items || !amount || !address) {
      console.log("placeOrder: Missing required fields");
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("placeOrder: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const user = await userModel.findById(userId);
    console.log("placeOrder: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("placeOrder: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderData = {
      userId: user._id,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };
    console.log("placeOrder: Order data prepared:", orderData);

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log("placeOrder: Order saved with ID:", newOrder._id);

    await userModel.findByIdAndUpdate(user._id, { cartData: {} });
    console.log("placeOrder: User cart cleared for ID:", user._id);

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("placeOrder: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place Order (Razorpay)
const placeOrderRazorpay = async (req, res) => {
  console.log("placeOrderRazorpay: Request received with body:", req.body);
  try {
    const { items, amount, address, currency } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("placeOrderRazorpay: User ID:", userId);

    if (!userId || !items || !amount || !address) {
      console.log("placeOrderRazorpay: Missing required fields");
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("placeOrderRazorpay: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const user = await userModel.findById(userId);
    console.log("placeOrderRazorpay: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("placeOrderRazorpay: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderData = {
      userId: user._id,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Pending Payment",
      date: Date.now(),
    };
    console.log("placeOrderRazorpay: Order data prepared:", orderData);

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log("placeOrderRazorpay: Order saved with ID:", newOrder._id);

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency?.toUpperCase() || "INR",
      receipt: newOrder._id.toString(),
    };
    console.log("placeOrderRazorpay: Razorpay options:", options);

    const razorpayOrder = await razorpayVal.orders.create(options);
    console.log("placeOrderRazorpay: Razorpay order created:", razorpayOrder);

    res.json({
      success: true,
      message: "Order initiated with Razorpay",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error("placeOrderRazorpay: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
  console.log("verifyRazorpay: Request received with body:", req.body);
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("verifyRazorpay: User ID:", userId);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("verifyRazorpay: Missing payment details");
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("verifyRazorpay: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    console.log("verifyRazorpay: Generated signature:", generatedSignature);
    console.log("verifyRazorpay: Received signature:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      console.log("verifyRazorpay: Invalid payment signature");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const orderInfo = await razorpayVal.orders.fetch(razorpay_order_id);
    console.log("verifyRazorpay: Order info from Razorpay:", orderInfo);

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
        status: "Order Placed",
      });
      console.log("verifyRazorpay: Order updated as paid, ID:", orderInfo.receipt);

      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      console.log("verifyRazorpay: User cart cleared for ID:", userId);

      res.json({ success: true, message: "Payment successful" });
    } else {
      console.log("verifyRazorpay: Payment not completed, status:", orderInfo.status);
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("verifyRazorpay: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Order Confirmation Email
const sendEmail = async (req, res) => {
  console.log("sendEmail: Request received with body:", req.body);
  try {
    const { orderData } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("sendEmail: User ID:", userId);

    if (!orderData || !orderData.email) {
      console.log("sendEmail: Missing orderData or email");
      return res.status(400).json({ success: false, message: "Invalid order data: email is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("sendEmail: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const user = await userModel.findById(userId);
    console.log("sendEmail: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("sendEmail: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { address, items, amount, paymentMethod, date, paymentId } = orderData;
    console.log("paymentId", paymentId);
    const customerEmail = orderData.email;
    const adminEmail = "dressfashiond@gmail.com"; // Replace with your admin email
    const currencySymbol = "₹";

    const emailTemplate = `
      <html>
      <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333; text-align: center;">Thank You for Your Order!</h2>
              <p>Hello <strong>${address.firstName} ${address.lastName}</strong>,</p>
              <p>We have received your order placed on <strong>${date}</strong>. Here are your order details:</p>
              
              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr>
                          <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 10px;">Item</th>
                          <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Quantity</th>
                          <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Price</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${items
        .map(
          (item) => `
                      <tr>
                          <td style="border-bottom: 1px solid #ddd; padding: 10px;">${item.name} (${item.size})</td>
                          <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${item.quantity}</td>
                          <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${currencySymbol}${((item.offerPrice || item.price) * item.quantity).toFixed(2)}</td>
                      </tr>`
        )
        .join("")}
                  </tbody>
              </table>
  
              <h3 style="text-align: right; color: #333;">Total: ${currencySymbol}${amount.toFixed(2)}</h3>
  
              <h4>Shipping Address:</h4>
              <p>${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>
  
              <h4>Payment Method:</h4>
              <p>${paymentMethod.toUpperCase()}${paymentMethod === "Razorpay" ? " (Paid)" : paymentMethod === "cod" ? " (Pay on Delivery)" : " (Payment Done ✔️)"}</p>
              ${paymentId
        ? `
                  <h4>Payment ID:</h4>
                  <p>${paymentId}</p>
                  `
        : ""
      }
  
              <div className="text-center text-sm text-zinc-400 space-y-1">
                <p>
                  Have questions? Contact us:
                </p>
                <p>
                  <a href="mailto:dressfashiond@gmail.com" className="text-pink-400 hover:underline">dressfashiond@gmail.com</a>
                </p>
                <p>
                  <a href="tel:+919160227573" className="text-pink-400 hover:underline">+91 91602 27573</a>
                </p>
              </div>

              
              <p style="text-align: center; color: #777;">Thank you for shopping with us!</p>
          </div>
      </body>
      </html>
      `;
    console.log("sendEmail: Email template prepared for:", customerEmail);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"VT Fashions" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: "VT Fashions Order Confirmation",
      html: emailTemplate,
    });
    console.log("sendEmail: Email sent to customer:", customerEmail);

    await transporter.sendMail({
      from: `"VT Fashions" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: "New Order Received",
      html: emailTemplate,
    });
    console.log("sendEmail: Email sent to admin:", adminEmail);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("sendEmail: Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  console.log("allOrders: Request received");
  try {
    const orders = await orderModel.find({});
    console.log("allOrders: Orders fetched:", orders.length);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("allOrders: Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// User Orders
const userOrders = async (req, res) => {
  console.log("userOrders: Request received");
  try {
    const userId = req.userId; // From authUser middleware
    console.log("userOrders: User ID:", userId);

    if (!userId) {
      console.log("userOrders: No userId provided");
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("userOrders: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const user = await userModel.findById(userId);
    console.log("userOrders: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("userOrders: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orders = await orderModel.find({ userId: user._id }).sort({ date: -1 });
    console.log("userOrders: Orders fetched:", orders.length);

    res.json({ success: true, orders });
  } catch (error) {
    console.error("userOrders: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
  console.log("updateStatus: Request received with body:", req.body);
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      console.log("updateStatus: Missing orderId or status");
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    console.log("updateStatus: Status updated for order:", orderId);

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("updateStatus: Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export { verifyRazorpay, placeOrder, placeOrderRazorpay, sendEmail, allOrders, userOrders, updateStatus };