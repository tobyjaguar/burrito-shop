import express, { Request, Response } from "express";

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        res.json({ message: 'Hello World' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;