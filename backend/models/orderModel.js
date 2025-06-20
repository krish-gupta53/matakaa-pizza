import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: { type: Array, required: true},
    amount: { type: Number, required: true},
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    status: {type: String, default: "Food Processing"},
    date: {type: Date, default: Date.now()},
    payment: {type: Boolean, default: false}
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;