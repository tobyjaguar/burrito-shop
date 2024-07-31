import mongoose from "mongoose";

export const OrderItemSchema = new mongoose.Schema({
    burrito: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Burrito',
        required: true
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
});

export const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
