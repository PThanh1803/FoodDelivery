import express from 'express';
import { createBooking,
    getBookingByUser,
    getBooking,cancelBooking, updateBooking} from '../controller/bookingController.js';
import authMiddleware from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/user/getBooking',authMiddleware, getBookingByUser);
bookingRouter.post('/user/cancelBooking',authMiddleware, cancelBooking);
bookingRouter.get('/getall', getBooking);
bookingRouter.post('/update/status', updateBooking);

export default bookingRouter