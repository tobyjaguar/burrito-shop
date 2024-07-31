import { Burrito } from '../models/burrito.js';

export const seed = async () => {
    // populate the database with some burritos
    const burritos = [
        { name: 'Al Pastor', sizePrices: [{size: "Regular", price: 10}, {size: "XL", price: 12}] },
        { name: 'Carne Asada', sizePrices: [{size: "Regular", price: 12}, {size: "XL", price: 15}] },
        { name: 'Carnitas', sizePrices: [{size: "Regular", price: 12}, {size: "XL", price: 15}] },
        { name: 'Chorizo', sizePrices: [{size: "Regular", price: 15}, {size: "XL", price: 20}] },
        { name: 'Vegetarian', sizePrices: [{size: "Regular", price: 8}, {size: "XL", price: 10}] },
    ];

    // add burritos to the database
    for (const burrito of burritos) {
        // await Burrito.create(burrito);
        const newBurrito = new Burrito(burrito);
        await newBurrito.save();
    }

    console.log('database seeded');
};