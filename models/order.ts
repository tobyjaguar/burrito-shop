import mongoose from "mongoose";
import { OrderItemSchema } from "./orderItem.js";

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
    },
    items: [OrderItemSchema],
    total: {
        type: Number,
        required: true,
    },
});

export const Order = mongoose.model('Order', OrderSchema);
