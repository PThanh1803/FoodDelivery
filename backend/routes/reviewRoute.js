import express from 'express';
import multer from 'multer';
import { addReview, deleteReview, getReviews, updateReview } from '../controller/reviewController.js';

const reviewRouter = express.Router();

// Image storage engine for reviews
const storage = multer.diskStorage({
    destination: "uploads/reviews",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Review routes
reviewRouter.post("/create", upload.array("images", 5), addReview); // Allow up to 5 images per review
reviewRouter.delete("/:id", deleteReview);
reviewRouter.get("/", getReviews);
reviewRouter.put("/:id", upload.array("images", 5), updateReview); // Allow up to 5 images when updating

export default reviewRouter;
