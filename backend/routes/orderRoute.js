import express from 'express';
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getTopSellingItems } from '../controller/orderController.js';
import authMiddleware from '../middleware/auth.js';



const orderRouter = express.Router();
orderRouter.post('/', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.get('/:id', authMiddleware, userOrders);
orderRouter.get('/', listOrders);
orderRouter.put('/:orderId', updateStatus);
orderRouter.get('/top/topseller', getTopSellingItems);

export default orderRouter
