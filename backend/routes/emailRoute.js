import express from 'express';
import { sendPassword } from '../controller/emailController.js';
import authMiddleware from '../middleware/auth.js';

const emailRouter = express.Router();


emailRouter.post('/password', sendPassword);

export default emailRouter