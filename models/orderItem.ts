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
      selectedIngredients: [{
        name: String,
        price: Number
      }]
});

export const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
