import mongoose from "mongoose";

const SizePriceSchema = new mongoose.Schema({
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
}, { _id: false });
  
export const BurritoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sizePrices: [SizePriceSchema]
});

export const Burrito = mongoose.model('Burrito', BurritoSchema);
