import express from 'express';
import { getPromotionById, getListPromotion, createPromotion, deletePromotion, updatePromotion, getActivePromotions } from '../controller/promotionController.js';
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
promotionRouter.post("/create", upload.single("image"), createPromotion);
promotionRouter.post("/promo/getbyid", getPromotionById);
promotionRouter.delete("/delete/:id", deletePromotion);
promotionRouter.put("/update", upload.single("image"), updatePromotion);
promotionRouter.get("/list", getListPromotion);
promotionRouter.get("/listview", getActivePromotions);
export default promotionRouter;
