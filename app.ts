import express, { Express } from "express";

import main from './routes/main.js';
import burrito from './routes/burrito.js';
import order from './routes/order.js';
import orderItem from './routes/order-item.js';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', main);
app.use('/api/burrito', burrito);
app.use('/api/orders', order);
app.use('/api/order-item', orderItem);
  
export default app;


