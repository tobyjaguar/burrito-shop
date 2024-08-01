import mongoose, { ConnectOptions } from 'mongoose';
import { Burrito } from '../models/burrito.js';
import { seed } from '../startup/seed-db.js';

// const url = process.env.MONGO_DB_URI as string;
const url = 'mongodb://localhost:27017/test';

export const connect = async () => {
    console.log('Connecting to MongoDB on', url);
    
    try {
        await mongoose.connect(url, {} as ConnectOptions);
        console.log('MongoDB connected');
        if (mongoose.connection.readyState) {
            console.log(`checking if the db has been seeded...`)
            const burritos = await Burrito.find();
            const count = await Burrito.countDocuments();
            if (count === 0) {
                console.log('seeding database');
                await seed();
            }
        }
    } catch (error) {
        console.error('MongoDB connection failed');
    }
}