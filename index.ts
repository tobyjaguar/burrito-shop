import express, { Express, Request, Response } from "express";
import 'dotenv/config';

import { connect } from './config/db.js';

import main from './routes/main.js';
import burrito from './routes/burrito.js';
import order from './routes/order.js';
import orderItem from './routes/order-item.js';

import { seed } from './startup/seed-db.js';

const app: Express = express();
const port = process.env.NODE_LOCAL_PORT || 3000;

await connect();
// console.log('seeding database');
// await seed();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', main);
app.use('/api/burrito', burrito);
app.use('/api/orders', order);
app.use('/api/order-item', orderItem);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

