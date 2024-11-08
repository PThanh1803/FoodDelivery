import express from 'express';
import {
    getListVoucher,
    getVoucherById,
    createVoucher,
    deleteVoucher,
    updateVoucher
} from '../controller/voucherController.js';
import multer from 'multer';


const voucherRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/vouchers",
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Voucher routes
voucherRouter.post("/", upload.single("image"), createVoucher);
voucherRouter.get("/:id", getVoucherById);
voucherRouter.get("/", getListVoucher);
voucherRouter.delete("/:id", deleteVoucher);
voucherRouter.put("/:id", upload.single("image"), updateVoucher);

export default voucherRouter;
