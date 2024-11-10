import express from 'express';
import { loginUser, registerUser, getUserById, updateUserById } from '../controller/userController.js';
import multer from 'multer';

const userRouter = express.Router();
const storage = multer.diskStorage({
    destination: "uploads/avatars",
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', upload.single('image'), updateUserById);

export default userRouter