import express from 'express';
import { getListVoucher, getVoucherById, createVoucher, deleteVoucher, updateVoucher } from '../controller/voucherController.js';
import multer from 'multer';

const voucherRouter = express.Router();

// Image storage engine for vouchers
const storage = multer.diskStorage({
    destination: "uploads/vouchers",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Voucher routes
voucherRouter.post("/create", upload.single("image"), createVoucher);
voucherRouter.get("/getbyid", getVoucherById);
voucherRouter.get("/list", getListVoucher);
voucherRouter.delete("/delete", deleteVoucher);
voucherRouter.put("/update", upload.single("image"), updateVoucher);

export default voucherRouter;
