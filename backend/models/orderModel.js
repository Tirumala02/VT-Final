// import mongoose from 'mongoose'

// const orderSchema = new mongoose.Schema({
//     userId: { type: String, required: true },
//     items: { type: Array, required: true },
//     amount: { type: Number, required: true },
//     address: { type: Object, required: true },
//     status: { type: String, required: true, default:'Order Placed' },
//     paymentMethod: { type: String, required: true },
//     payment: { type: Boolean, required: true , default: false },
//     date: {type: Number, required:true}
// })

// const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
// export default orderModel;
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: Array, required: true },
    address: { type: Object, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    status: { type: String, default: "Order Placed" }, // Pending, Delivered
    date: {type: Number, required:true},
    deliveredAt: { type: String } // Stores the delivery date
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
