import voucherModel from "../models/voucherModel.js";


const getListVoucher = async (req, res) => {
    try {
        const voucherData = await voucherModel.find();
        res.json({ success: true, vouchers: voucherData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching vouchers" });
    }
};

// Lấy thông tin mã giảm giá bằng id 
const getVoucherById = async (req, res) => {
    try {
        const voucherData = await voucherModel.findById(req.body.id);
        
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
            maxDiscount: voucherData.maxDiscount
        });
        
        await newVoucher.save();
        res.json({ success: true, message: "Voucher created successfully", voucher: newVoucher });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating voucher" });
    }
};

// Xóa mã giảm giá
const deleteVoucher = async (req, res) => {
    try {
        const deletedVoucher = await voucherModel.findByIdAndDelete(req.body.id);
        fs.unlink(`uploads/${deletedVoucher.image}`,()=>{});
        if (!deletedVoucher) {
            return res.json({ success: false, message: "Voucher not found" });
        }

        res.json({ success: true, message: "Voucher deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting voucher" });
    }
};

// Cập nhật mã giảm giá
const updateVoucher = async (req, res) => {
    try {
        const voucherData = JSON.parse(req.body.voucherData);
        const updatedVoucher = await voucherModel.findById(voucherData.id);
        console.log(updatedVoucher);
        if (!updatedVoucher) {
            console.log("Voucher not found");
            return res.json({ success: false, message: "Voucher not found" });
        }
        const updateData = {
            voucherCode:voucherData.voucherCode,
            discountAmount: voucherData.discountAmount,
            discountType: voucherData.discountType,
            expiryDate: voucherData.expiryDate,
            status: voucherData.status,
            description: voucherData.description,
            startDate:voucherData.startDate,
            usageLimit: voucherData.usageLimit,
            minOrder: voucherData.minOrder,
            maxDiscount: voucherData.maxDiscount
        };

        if (req.file) {
            const image_filename = `${req.file.filename}`;
            updateData.image = image_filename; // Update with new image filename
        } else {
            updateData.image = updatedVoucher.image; // Retain the old image filename
        }
      
        await voucherModel.findByIdAndUpdate(voucherData.id, updateData);
        res.json({ success: true, message: "Voucher updated successfully", voucher: updateData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating voucher" });
    }
};

export { getListVoucher, getVoucherById, createVoucher, deleteVoucher, updateVoucher };
