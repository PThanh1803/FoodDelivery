import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controller/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();


cartRouter.post('/', authMiddleware, addToCart);
cartRouter.get('/', authMiddleware, getCart);
cartRouter.delete('/:id', authMiddleware, removeFromCart);

export default cartRouter;