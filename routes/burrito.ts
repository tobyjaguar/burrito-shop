import express, { Request, Response } from "express";
import { Burrito } from '../models/burrito.js';
import auth from '../middleware/auth.js';

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

router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const newBurrito = new Burrito(req.body);
        const result = await newBurrito.save();
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;