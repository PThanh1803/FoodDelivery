import express from 'express';
import { loginUser, registerUser, getUserById, updateUserById } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUserById);

export default userRouter