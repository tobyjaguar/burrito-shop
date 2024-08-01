import { Request, Response, NextFunction } from "express";
import 'dotenv/config'; // add for test suite (index does not run)

const API_KEY = process.env.API_KEY; // Stored in the environment variable

const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.get('X-Api-Key');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Invalid or missing API key' });
  }
  
  next();
};

export default validateApiKey;