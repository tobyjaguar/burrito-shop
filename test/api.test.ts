import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

import { Burrito } from '../models/burrito.js';  
import { Order } from '../models/order.js';  
import { burritoStock } from '../startup/seed-db.js';
import 'dotenv/config';

const url = process.env.MONGO_DB_URI as string;
// const url = 'mongodb://localhost:27017/test';
const API_KEY = process.env.API_KEY as string; // Stored in the environment variable

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
  it('should create a new burrito', async () => {
    const res = await request(app)
    .post('/api/burrito')
    .set('X-Api-Key', API_KEY) //authenticated endpoint
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
    })
    
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

  it('should return all burritos', async () => {
    for (const burrito of burritoStock) {
      const newBurrito = new Burrito(burrito);
      await newBurrito.save();
    }

    const res = await request(app).get('/api/burrito');
    expect(res.statusCode).equal(200);
    expect(res.body.count).equal(7);
    expect(res.body.burritos).to.have.length(7);
    expect(res.body.burritos[0]).to.have.any.keys('_id', 'name', 'sizePrices', 'optionalIngredients');

    // Al Pastor
    expect(res.body.burritos[0].name).equal('Al Pastor');
    expect(res.body.burritos[0].sizePrices).to.have.length(2);
    expect(res.body.burritos[0].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[0].sizePrices[0].price).equal(10);
    expect(res.body.burritos[0].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[0].sizePrices[1].price).equal(12);
    expect(res.body.burritos[0].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[0].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[0].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[0].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[0].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[0].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[0].optionalIngredients[2].price).equal(3);

    // Carne Asada
    expect(res.body.burritos[1].name).equal('Carne Asada');
    expect(res.body.burritos[1].sizePrices).to.have.length(2);
    expect(res.body.burritos[1].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[1].sizePrices[0].price).equal(12);
    expect(res.body.burritos[1].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[1].sizePrices[1].price).equal(15);
    expect(res.body.burritos[1].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[1].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[1].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[1].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[1].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[1].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[1].optionalIngredients[2].price).equal(3);

    // Carnitas
    expect(res.body.burritos[2].name).equal('Carnitas');
    expect(res.body.burritos[2].sizePrices).to.have.length(2);
    expect(res.body.burritos[2].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[2].sizePrices[0].price).equal(12);
    expect(res.body.burritos[2].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[2].sizePrices[1].price).equal(15);
    expect(res.body.burritos[2].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[2].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[2].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[2].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[2].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[2].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[2].optionalIngredients[2].price).equal(3);

    // Chorizo
    expect(res.body.burritos[3].name).equal('Chorizo');
    expect(res.body.burritos[3].sizePrices).to.have.length(2);
    expect(res.body.burritos[3].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[3].sizePrices[0].price).equal(15);
    expect(res.body.burritos[3].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[3].sizePrices[1].price).equal(20);
    expect(res.body.burritos[3].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[3].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[3].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[3].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[3].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[3].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[3].optionalIngredients[2].price).equal(3);

    // Chicken
    expect(res.body.burritos[4].name).equal('Chicken');
    expect(res.body.burritos[4].sizePrices).to.have.length(2);
    expect(res.body.burritos[4].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[4].sizePrices[0].price).equal(12);
    expect(res.body.burritos[4].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[4].sizePrices[1].price).equal(15);
    expect(res.body.burritos[4].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[4].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[4].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[4].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[4].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[4].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[4].optionalIngredients[2].price).equal(3);

    // Fish
    expect(res.body.burritos[5].name).equal('Fish');
    expect(res.body.burritos[5].sizePrices).to.have.length(2);
    expect(res.body.burritos[5].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[5].sizePrices[0].price).equal(14);
    expect(res.body.burritos[5].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[5].sizePrices[1].price).equal(18);
    expect(res.body.burritos[5].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[5].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[5].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[5].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[5].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[5].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[5].optionalIngredients[2].price).equal(3);

    // Vegetarian
    expect(res.body.burritos[6].name).equal('Vegetarian');
    expect(res.body.burritos[6].sizePrices).to.have.length(2);
    expect(res.body.burritos[6].sizePrices[0].size).equal('Regular');
    expect(res.body.burritos[6].sizePrices[0].price).equal(8);
    expect(res.body.burritos[6].sizePrices[1].size).equal('XL');
    expect(res.body.burritos[6].sizePrices[1].price).equal(10);
    expect(res.body.burritos[6].optionalIngredients).to.have.length(3);
    expect(res.body.burritos[6].optionalIngredients[0].name).equal('Black Olives');
    expect(res.body.burritos[6].optionalIngredients[0].price).equal(2);
    expect(res.body.burritos[6].optionalIngredients[1].name).equal('Rice');
    expect(res.body.burritos[6].optionalIngredients[1].price).equal(1);
    expect(res.body.burritos[6].optionalIngredients[2].name).equal('Sour Cream');
    expect(res.body.burritos[6].optionalIngredients[2].price).equal(3);
  });

  it('should fail to add stock if unauthorized', async () => {
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
    })
    expect(res.statusCode).equal(401);
    expect(res.body).to.have.property('message');
    expect(res.body.message).equal('Invalid or missing API key');
  });
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
    .set('X-Api-Key', API_KEY) //authenticated endpoint
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

  it('should list an order', async () => {
    for (const burrito of burritoStock) {
      const newBurrito = new Burrito(burrito);
      await newBurrito.save();
    }

    let order1 = {
      order: [
          { burrito: "Al Pastor", size: "XL", quantity: 2 },
          { burrito: "Carne Asada", size: "XL", quantity: 1 },
          { burrito: "Chicken", size: "Regular", quantity: 1, selectedIngredients: [{ name: "Black Olives", price: 2 }]},
          { burrito: "Fish", size: "Regular", quantity: 2, selectedIngredients: [{ name: "Sour Cream", price: 3 }] }
      ]
    };

    let order2 = {
      order: [
          { burrito: "Vegetarian", size: "XL", quantity: 2, selectedIngredients: [{ name: "Sour Cream", price: 3 }] },
          { burrito: "Chorizo", size: "XL", quantity: 1, selectedIngredients: [{ name: "Rice", price: 1 }] },
          { burrito: "Chicken", size: "Regular", quantity: 1, selectedIngredients: [{ name: "Black Olives", price: 2 }]},
          { burrito: "Fish", size: "Regular", quantity: 2, selectedIngredients: [{ name: "Black Olives", price: 2 }, { name: "Sour Cream", price: 3 }] }
      ]
    };

    // place an order
    await request(app)
    .post('/api/orders')
    .set('X-Api-Key', API_KEY) //authenticated endpoint
    .send(order1);

    const orderRes = await request(app)
    .post('/api/orders')
    .set('X-Api-Key', API_KEY) //authenticated endpoint
    .send(order2);

    expect(orderRes.statusCode).equal(200);
    expect(orderRes.body.result.orderNumber).equal(2);
    let orderNumber = orderRes.body.result.orderNumber;

    // list order 2
    const res = await request(app).get(`/api/orders/${orderNumber}`);
    expect(res.statusCode).equal(200);
    expect(res.body).to.have.property('_id'); // to be defined
    expect(res.body.total).equal(99);
    expect(res.body.items).to.have.length(4);
    expect(res.body.items[0]).to.include({ burritoName: "Vegetarian", size: "XL", quantity: 2 });
    expect(res.body.items[0].selectedIngredients[0]).to.include({ name: "Sour Cream", price: 3 });
    expect(res.body.items[1]).to.include({ burritoName: "Chorizo", size: "XL", quantity: 1 });
    expect(res.body.items[1].selectedIngredients[0]).to.include({ name: "Rice", price: 1 });
    expect(res.body.items[2]).to.include({ burritoName: "Chicken", size: "Regular", quantity: 1 });
    expect(res.body.items[2].selectedIngredients[0]).to.include({ name: "Black Olives", price: 2 });
    expect(res.body.items[3]).to.include({ burritoName: "Fish", size: "Regular", quantity: 2 });
    expect(res.body.items[3].selectedIngredients[0]).to.include({ name: "Black Olives", price: 2 });
    expect(res.body.items[3].selectedIngredients[1]).to.include({ name: "Sour Cream", price: 3 });
  });

  it('should fail to place an order', async () => {
    for (const burrito of burritoStock) {
      const newBurrito = new Burrito(burrito);
      await newBurrito.save();
    }

    let order = {
      order: [
          { burrito: "Chocolate", size: "XL", quantity: 1 }
      ]
    };

    let res = await request(app)
    .post('/api/orders')
    .set('X-Api-Key', API_KEY) //authenticated endpoint
    .send(order);
    expect(res.statusCode).equal(404);
    expect(res.body).to.have.property('error');
    expect(res.text).include('Burrito not found');
  });

  it('should fail to list a non-existant order', async () => {
    let res = await request(app).get('/api/orders/1');
    expect(res.statusCode).equal(404);
    expect(res.body).to.have.property('error');
    expect(res.body.error).equal('Order not found');
  });

  it('should fail to place an unauthorized order', async () => {
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

    let res = await request(app)
    .post('/api/orders')
    .send(order);
    expect(res.statusCode).equal(401);
    expect(res.body).to.have.property('message');
    expect(res.body.message).equal('Invalid or missing API key');
  });
});