import express from 'express';
import { addToWishlist, getWishlistByUser, removeFromWishlist } from '../controller/wishlistController.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/', addToWishlist);
wishlistRouter.get('/:userId', getWishlistByUser);
wishlistRouter.delete('/:id', removeFromWishlist);

export default wishlistRouter;
