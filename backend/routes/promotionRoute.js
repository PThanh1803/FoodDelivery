import express from 'express';
import { getPromotionById, getListPromotion, createPromotion, deletePromotion, updatePromotion } from '../controller/promotionController.js';
import multer from 'multer';

const promotionRouter = express.Router();

// Image storage engine for promotions
const storage = multer.diskStorage({
    destination: "uploads/promotions",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Promotion routes
promotionRouter.post("/", upload.single("image"), createPromotion);
promotionRouter.get("/:id", getPromotionById);
promotionRouter.delete("/:id", deletePromotion);
promotionRouter.put("/:id", upload.single("image"), updatePromotion);
promotionRouter.get("/", getListPromotion);
export default promotionRouter;
