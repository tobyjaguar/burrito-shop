import express, { Request, Response } from "express";
import { Burrito } from '../models/burrito.js';
import { Order } from '../models/order.js';
import { OrderItem } from '../models/orderItem.js';
import auth from '../middleware/auth.js';
import { sendPayment } from "../blockchain/sendPayment.js";

const router = express.Router();

interface IngredientType {
    name: string;
    price: number;
}

interface BurritoType {
    _id: string;
    name: string;
    sizePrices: {
        size: string;
        price: number;
    }[];
}

interface OrderType {
    burrito: BurritoType;
    size: string;
    quantity: number;
    selectedIngredients: IngredientType[];
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const orderId = await Order.findOne({orderNumber: req.params.id});
        if (!orderId) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order: any = await Order.findById(orderId)
        .populate({
            path: 'items.burrito',
            select: 'name sizePrices' // Only return the name and sizePrices fields
        });
        const formattedOrder: any = {
            _id: order?._id,
            total: order?.total,
            items: order?.items.map((item: OrderType) => ({
              burritoName: item.burrito.name,
              size: item.size,
              quantity: item.quantity,
              price: item.burrito.sizePrices.find((sp: any) => sp.size === item.size)?.price,
              selectedIngredients: item.selectedIngredients.map((ingredient: IngredientType) => ({
                name: ingredient.name,
                price: ingredient.price
              }))
            }))
        };
        res.json(formattedOrder);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

function calculateTotal(
    burrito: BurritoType, 
    size: string, 
    quantity: number, 
    selectedIngredients: IngredientType[]
) {
    const basePrice = burrito.sizePrices.find(sp => sp.size === size)?.price || 0;
    const xtrasPrice = (selectedIngredients) ? selectedIngredients.reduce((sum, xtras) => sum + xtras.price, 0) : 0;
    return (basePrice + xtrasPrice) * quantity;
  }

router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const orderNumber = await Order.countDocuments() + 1;
        let items = req.body.order;
        
        // Get all burritos
        const burritos: BurritoType[] = await Burrito.find();

        let orderItems = [];
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            // Check if the burrito exists
            const currentItem = items[i];

            const matchingBurrito = burritos.find(b => b.name === currentItem.burrito);

            if (!matchingBurrito) {
                return res.status(404).json({ error: 'Burrito not found' });
            }

            // Check if the size exists for this burrito
            let sizeFound = false, price = 0;
            matchingBurrito.sizePrices.forEach(sp => {
                if (sp.size === currentItem.size) {
                    sizeFound = true;
                    price = sp.price;
                }
            })
            // if (!matchingBurrito.sizePrices.find(sp => sp.size === currentItem.size)) {
            if (!sizeFound) {
                return res.status(400).json({ error: `Invalid size for burrito: ${currentItem.burrito}, size: ${currentItem.size}` });
            }

            const item = new OrderItem({
                burrito: matchingBurrito._id,  // Use the burrito's _id
                size: currentItem.size,
                quantity: currentItem.quantity,
                selectedIngredients: currentItem.selectedIngredients
            });
            orderItems.push(item);
            total += calculateTotal(matchingBurrito, currentItem.size, currentItem.quantity, currentItem.selectedIngredients);
        }
        const order = new Order({orderNumber: orderNumber, total: total, items: orderItems});
        const result = await order.save();
        // const result = 'bypassed';
        res.json({ message: 'Order created', result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/complete/:id', auth, async (req: Request, res: Response) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.id });
        const total = order?.total || 0;
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        await Order.deleteOne({ orderNumber: req.params.id });
        // if ethereum address is provided, send the total amount to the address
        if (req.body.ethereumAddress) {
            // send total amount to the ethereum address
            if (total === 0) {
                return res.status(400).json({ error: 'Total amount is 0' });
            }
            await sendPayment(req.body.ethereumAddress, total);
        }
        res.json({ message: 'Order completed' });
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;