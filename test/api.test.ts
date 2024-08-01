import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

import { Burrito } from '../models/burrito.js';  
import { Order } from '../models/order.js';  
import { burritoStock } from '../startup/seed-db.js';
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

describe('testing the APIs', () => {
  it ('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).equal(200);
    expect(res.text).include('Welcome to the Burrito API!');
  });
});

describe('testing the Burrito endpoint', () => {
  it ('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).equal(200);
    expect(res.text).to.include('Welcome to the Burrito API!');
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
            { name: "Black Olives", price: 2 },
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
    expect(res.body.optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.optionalIngredients[0].price).equal(2);
    expect(res.body.optionalIngredients[1].name).equal('Rice');
    expect(res.body.optionalIngredients[1].price).equal(1);
    expect(res.body.optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.optionalIngredients[2].price).equal(3);
  });

  // Add more burrito tests
});

describe('testing Order endpoint', () => {
  it('should create a new order', async () => {
    // Add burrito stock to the database
    for (const burrito of burritoStock) {
      const newBurrito = new Burrito(burrito);
      await newBurrito.save();
    }

    let order = {
      order: [
          { burrito: "Al Pastor", size: "XL", quantity: 2 },
          { burrito: "Carne Asada", size: "XL", quantity: 1 },
          { burrito: "Chicken", size: "Regular", quantity: 1, selectedIngredients: [{ name: "Black Olives", price: 2 }]},
          { burrito: "Fish", size: "Regular", quantity: 2, selectedIngredients: [{ name: "Sour Cream", price: 3 }] }
      ]
    };

    const res = await request(app)
    .post('/api/orders')
    .send(order);

    expect(res.statusCode).equal(200);
    expect(res.body.message).to.include('Order created');
    expect(res.body.result.orderNumber).equal(1);
    expect(res.body.result.items).to.have.length(4);
    expect(res.body.result.items[0]).to.have.any.keys('burrito', '_id', 'size', 'quantity', 'selectedIngredients');
    expect(res.body.result.items[0]).to.include({ size: "XL", quantity: 2 });
    expect(res.body.result.items[1]).to.include({ size: "XL", quantity: 1 });
    expect(res.body.result.items[2]).to.include({ size: "Regular", quantity: 1 });
    expect(res.body.result.items[2].selectedIngredients[0]).to.include({ name: "Black Olives", price: 2 });
    expect(res.body.result.items[3]).to.include({ size: "Regular", quantity: 2 });
    expect(res.body.result.items[3].selectedIngredients[0]).to.include({ name: "Sour Cream", price: 3 });
    expect(res.body.result.total).equal(87);
  });

  // Add more order-related tests
});