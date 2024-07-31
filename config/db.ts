import mongoose, { ConnectOptions } from 'mongoose';

// const url = 'mongodb://mongo:27017/docker-node-mongo';
// const url = process.env.MONGO_DB_URI as string;
const url = 'mongodb://localhost:27017/test';

export const connect = async () => {
    console.log('Connecting to MongoDB');
    
    try {
        await mongoose.connect(url, {} as ConnectOptions);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed');
    }
}