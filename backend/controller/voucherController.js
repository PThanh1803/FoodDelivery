import voucherModel from "../models/voucherModel.js";


const getListVoucher = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const statusFilter = req.query.status || null;
        const dateFilter = req.query.date || null;
        const code = req.query.code || null;
        console.log("statusFilter:", statusFilter, "dateFilter:", dateFilter ,"code:", code);
        // Tạo một đối tượng filter để lưu các điều kiện lọc
        const filter = {};

        if (statusFilter && statusFilter !== "All") {
            filter.status = statusFilter; // Thêm điều kiện trạng thái nếu có
        }

        if (dateFilter) {
            filter.expiryDate = { $gte: new Date(dateFilter) }; // Thêm điều kiện ngày nếu có
        }

        if (code) {
            // Sử dụng regex để tìm các mã voucher chứa dãy code
            filter.voucherCode = { $regex: code, $options: 'i' }; // 'i' là tùy chọn không phân biệt chữ hoa chữ thường
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
