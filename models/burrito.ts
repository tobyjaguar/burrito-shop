import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
}, { _id: false });

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
    sizePrices: [SizePriceSchema],
    optionalIngredients: [IngredientSchema],
});

export const Burrito = mongoose.model('Burrito', BurritoSchema);
