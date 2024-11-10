import voucherModel from "../models/voucherModel.js";
import fs from "fs";

const getListVoucher = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const statusFilter = req.query.status || null;
        const dateFilter = req.query.date || null;

      
        const code = req.query.code || null;            
        const filter = {};

        if (statusFilter && statusFilter !== "All") {
            filter.status = statusFilter; // Thêm điều kiện trạng thái nếu có
        }

        if (dateFilter) {
            filter.expiryDate = { $gte: new Date(dateFilter) }; // Thêm điều kiện ngày nếu có
        }

        if (code) {
            // Sử dụng regex để tìm các mã voucher chúa dãy code
            filter.voucherCode = { $regex: code, $options: 'i' };      
        }

        if (code && req.query.type === "getByCode") {
            // Sử dụng regex để tìm các mã voucher chứa dãy code
            filter.voucherCode = { $regex: code, $options: 'i' };      
            const voucherData = await voucherModel.findOne({voucherCode: code});
            
            if (!voucherData) {
                return res.json({ success: false, message: "Voucher not found" });
            }
            if(voucherData.expiryDate < new Date()){
                return res.json({ success: false, message: "Voucher has expired" });
            }
            if(voucherData.used >= voucherData.usageLimit){
                return res.json({ success: false, message: "Voucher has been used up" });
            }
                
            res.json({ success: true, voucher: voucherData, message: "Voucher added successfully" });
            return
            
        }
        // Tổng số voucher
        const totalVouchers = await voucherModel.countDocuments(filter);

        console.log("Total vouchers:", totalVouchers);

        // Tính tổng số trang
        const totalPages = Math.ceil(totalVouchers / limit);

        console.log("Total pages:", totalPages);

        // Kiểm tra nếu số trang yêu cầu vượt quá số trang hiện có
        if (page > totalPages) {
            return res.json({
                success: false,
                message: "No more vouchers available",
                totalPages,
                totalVouchers
            });
        }

        // Thực hiện phân trang nếu page hợp lệ
        const skip = (page - 1) * limit;
        const voucherData = await voucherModel.find(filter).skip(skip).limit(limit);

        res.json({
            success: true,
            vouchers: voucherData,
            pagination: {
                totalVouchers,
                currentPage: page,
                totalPages,
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching vouchers" });
    }
};




// Lấy thông tin mã giảm giá bằng id 
const getVoucherById = async (req, res) => {

   
        try {
            const voucherData = await voucherModel.findById(req.params.id);
            
            if (!voucherData) {
                return res.json({ success: false, message: "Voucher not found" });
            }
            
            res.json({ success: true, voucher: voucherData });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error fetching voucher" });
        }

};

// Tạo mã giảm giá mới
const createVoucher = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    let voucherData = JSON.parse(req.body.voucherData);
    try {
        const voucher = await voucherModel.findOne({voucherCode: voucherData.voucherCode});
        if (voucher) {
            return res.json({ success: false, message: "Voucher code already exists" });
        }
        const newVoucher = new voucherModel({
            voucherCode: voucherData.voucherCode,
            discountAmount: voucherData.discountAmount,
            discountType: voucherData.discountType,
            expiryDate: voucherData.expiryDate,
            status: voucherData.status,
            description: voucherData.description,
            image: image_filename,
            startDate: voucherData.startDate,
            usageLimit: voucherData.usageLimit,
            minOrder: voucherData.minOrder,
            maxDiscount: voucherData.maxDiscount,
            used: 0
        });
        await newVoucher.save();
        res.json({ success: true, message: "Voucher created successfully", voucher: newVoucher });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating voucher" });
    }
};

// Xóa mã giảm giá
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
    }
};

// Other functions remain as they are with status codes added

const deleteVoucher = async (req, res) => {
    try {
        const voucher = await voucherModel.findByIdAndDelete(req.params.id);

        if (!voucher) {
            return res.status(404).json({ success: false, message: "Voucher not found" });
        }

        deleteFile(`uploads/vouchers/${voucher.image}`);

        res.status(200).json({ success: true, message: "Voucher deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error deleting voucher" });
    }
};

const updateVoucher = async (req, res) => {
    try {
        const voucherData = JSON.parse(req.body.voucherData);
        const voucher = await voucherModel.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ success: false, message: "Voucher not found" });
        }
        const updateData = {
            voucherCode: voucherData.voucherCode,
            discountAmount: voucherData.discountAmount,
            discountType: voucherData.discountType,
            expiryDate: voucherData.expiryDate,
            status: voucherData.status,
            description: voucherData.description,
            startDate: voucherData.startDate,
            usageLimit: voucherData.usageLimit,
            minOrder: voucherData.minOrder,
            maxDiscount: voucherData.maxDiscount,
            image: voucher.image,
            used: voucherData.used // default to old image
        };

        if (req.file) {
            deleteFile(`uploads/vouchers/${voucher.image}`); // Delete old image
            updateData.image = req.file.filename; // Set new image
        }

        await voucherModel.findByIdAndUpdate(voucherData.id, updateData);
        res.status(200).json({ success: true, message: "Voucher updated successfully", voucher: updateData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating voucher" });
    }
};

export { getListVoucher, getVoucherById, createVoucher, deleteVoucher, updateVoucher };
