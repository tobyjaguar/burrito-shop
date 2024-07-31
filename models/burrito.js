"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Burrito = exports.BurritoSchema = void 0;
var mongoose_1 = require("mongoose");
var SizePriceSchema = new mongoose_1.default.Schema({
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, { _id: false });
exports.BurritoSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    sizePrices: [SizePriceSchema]
});
exports.Burrito = mongoose_1.default.model('Burrito', exports.BurritoSchema);
