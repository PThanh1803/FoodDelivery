import express from 'express';
import {
    createBooking,
    getBookingByUser,
    getBooking, updateBookingStatus
} from '../controller/bookingController.js';
import authMiddleware from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/', createBooking);
bookingRouter.get('/byUserId', authMiddleware, getBookingByUser);
bookingRouter.get('/', getBooking);
bookingRouter.put('/:id', authMiddleware, updateBookingStatus);

export default bookingRouter