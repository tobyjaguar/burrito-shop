import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

import { Burrito } from '../models/burrito.js';  
import { Order } from '../models/order.js';  
import 'dotenv/config';

// const url = process.env.MONGO_DB_URI as string;
const url = 'mongodb://localhost:27017/test';


// beforeAll(async () => {
before(async () => {
  // Connect to a test database
  await mongoose.connect(url);
});

// afterAll(async () => {
after(async () => {
  // Disconnect from the test database
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the database before each test
  await Burrito.deleteMany({});
  await Order.deleteMany({});
});

describe('Testing the APIs', () => {
  it ('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).equal(200);
    expect(res.text).include('Welcome to the Burrito API!');
  });

  it('should create a new burrito', async () => {
    const res = await request(app)
    .post('/api/burrito')
    .send({
        name: "Test Burrito",
        sizePrices: [
            { size: "Regular", price: 10 },
            { size: "XL", price: 12 }
        ],
        optionalIngredients: [
            { name: "Sour Cream", price: 2 },
            { name: "Rice", "price": 1 },
            { name: "Sour Cream", price: 3 }
        ]
    });
    expect(res.statusCode).equal(201);
    expect(res.body).to.have.property('_id'); // to be defined
    expect(res.body.name).equal('Test Burrito');
    expect(res.body.sizePrices).to.have.length(2);
    expect(res.body.sizePrices[0].size).equal('Regular');
    expect(res.body.sizePrices[1].size).equal('XL');
    expect(res.body.sizePrices[0].price).equal(10);
    expect(res.body.sizePrices[1].price).equal(12);
    expect(res.body.optionalIngredients).to.have.length(3);
    expect(res.body.optionalIngredients[0].name).equal('Sour Cream');
  });

  // Add more burrito-related tests
});

// describe('Order API', () => {
//   it('should create a new order', async () => {
//     // Create a burrito
//     const burrito = await Burrito.create({
//       name: "Test Burrito",
//       sizePrices: [{ size: "Regular", price: 10 }],
//       optionalIngredients: [{ name: "Sour Cream", price: 1.50 }]
//     });

//     const res = await request(app)
//     .post('/api/orders')
//     .send({
//         items: [{
//           burrito: burrito._id,
//           size: "Regular",
//           quantity: 1,
//           selectedIngredients: [{ name: "Sour Cream", price: 1.50 }]
//         }],
//         total: 11.50  // 10 for burrito + 1.50 for sour cream
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body.total).toEqual(11.50);
//   });

//   // Add more order-related tests
// });