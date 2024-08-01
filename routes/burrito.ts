import express, { Request, Response } from "express";
import { Burrito } from '../models/burrito.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const burritos = await Burrito.find();
        const count = await Burrito.countDocuments();
        res.json({
            count: count,
            burritos
        });
        // res.json({ message: 'list of burritos' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const newBurrito = new Burrito(req.body);
        const result = await newBurrito.save();
        console.log(result);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;