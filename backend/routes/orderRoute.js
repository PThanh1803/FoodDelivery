import express from 'express';
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getTopSellingItems } from '../controller/orderController.js';
import authMiddleware from '../middleware/auth.js';



const orderRouter = express.Router();
orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/list', listOrders);
orderRouter.post('/status', updateStatus);
orderRouter.get('/topseller', getTopSellingItems);

export default orderRouter
