import { Burrito } from '../models/burrito.js';

const ingredients = [
    { name: "Black Olives", price: 2 },
    { name: "Rice", price: 1 },
    { name: "Sour Cream", price: 3 }
] 

export const burritoStock = [
    { 
        name: 'Al Pastor', 
        sizePrices: [{size: "Regular", price: 10}, {size: "XL", price: 12}],
        optionalIngredients: [...ingredients]
    },
    { 
        name: 'Carne Asada', 
        sizePrices: [{size: "Regular", price: 12}, {size: "XL", price: 15}],
        optionalIngredients: [...ingredients] 
    },
    { 
        name: 'Carnitas', 
        sizePrices: [{size: "Regular", price: 12}, {size: "XL", price: 15}],
        optionalIngredients: [...ingredients] 
    },
    { 
        name: 'Chorizo', 
        sizePrices: [{size: "Regular", price: 15}, {size: "XL", price: 20}],
        optionalIngredients: [...ingredients] 
    },
    { 
        name: 'Chicken', 
        sizePrices: [{size: "Regular", price: 12}, {size: "XL", price: 15}],
        optionalIngredients: [...ingredients] 
    },
    { 
        name: 'Fish', 
        sizePrices: [{size: "Regular", price: 14}, {size: "XL", price: 18}],
        optionalIngredients: [...ingredients] 
    },
    { 
        name: 'Vegetarian', 
        sizePrices: [{size: "Regular", price: 8}, {size: "XL", price: 10}],
        optionalIngredients: [...ingredients] 
    },
];

// populate the database with some burritos
export const seed = async () => {
    // add burritos to the database
    for (const burrito of burritoStock) {
        // await Burrito.create(burrito);
        const newBurrito = new Burrito(burrito);
        await newBurrito.save();
    }

    console.log('database seeded');
};