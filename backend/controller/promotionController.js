import promotionModel from "../models/promotionModel.js";
import fs from "fs";

// Lọc khuyến mái
const getListPromotion = async (req, res) => {
    try {
        const { page = 1, limit = 5, status = "", startDate = "", expiryDate = "" } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = {};

        // Date range filter
        if (startDate && expiryDate) {
            filter.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Status filter
        if (status) {
            filter.status = status;
        }

        // Fetch promotions with pagination and filter
        const promotions = await promotionModel.find(filter).skip(skip).sort({ dateCreated: -1 }).limit(parseInt(limit));
        
        // Count total filtered promotions for accurate pagination
        const totalPromotions = await promotionModel.countDocuments(filter);
        
        res.json({
            success: true,
            promotions,
            totalPromotions,
            totalPages: Math.ceil(totalPromotions / parseInt(limit)),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching promotions" });
    }
};



// const getActivePromotions = async (req, res) => {
//     try {
//         const currentDate = new Date(); // Thời gian hiện tại
//         const promotions = await promotionModel.find({
//             expiryDate: { $gt: currentDate },  // Chỉ lấy những promotion có expiryDate lớn hơn thời gian hiện tại
//             status: "active"  // Chỉ lấy những promotion có trạng thái là "active"
//         });

//         res.json({ success: true, promotions });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error fetching active promotions" });
//     }
// };

// Lấy thông tin chi tiết khuyến mãi by id
const getPromotionById = async (req, res) => {
    try {
        console.log("id: ", req.params.id);
        const promotion = await promotionModel.findById(req.params.id);

        if (!promotion) {
            return res.json({ success: false, message: "Promotion not found" });
        }

        res.json({ success: true, promotion });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching promotion" });
    }
};

// Tạo khuyến mãi mới
const createPromotion = async (req, res) => {
    const image_filename = `${req.file.filename}`;
    try {
        const newPromotion = new promotionModel({
            title: req.body.title,
            startDate: req.body.startDate,
            expiryDate: req.body.expiryDate,
            status: req.body.status,
            description: req.body.description,
            content: req.body.content,
            image: image_filename,
            dateCreated: Date.now(),
        });
        console.log("newPromotion: ", newPromotion);
        await newPromotion.save();
        res.json({ success: true, message: "Promotion created successfully", promotion: newPromotion });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating promotion" });
    }
};

// Xóa khuyến mãi
const deletePromotion = async (req, res) => {
    try {
        const deletedPromotion = await promotionModel.findByIdAndDelete(req.params.id);
        fs.unlink(`uploads/promotions/${deletedPromotion.image}`, () => { });
        if (!deletedPromotion) {
            return res.json({ success: false, message: "Promotion not found" });
        }

        res.json({ success: true, message: "Promotion deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting promotion" });
    }
};

// Cập nhật khuyến mãi
const updatePromotion = async (req, res) => {
    try {
        const updatedPromotion = await promotionModel.findById(req.params.id);
        if (!updatedPromotion) {
            return res.json({ success: false, message: "Promotion not found" });
        }
        const updateData = {
            title: req.body.title,
            startDate: req.body.startDate,
            expiryDate: req.body.expiryDate,
            status: req.body.status,
            description: req.body.description,
            content: req.body.content,
            dateCreated: Date.now(),
        }
        if (req.file) {
            const image_filename = `${req.file.filename}`;
            updateData.image = image_filename; // Update with new image filename
            fs.unlink(`uploads/promotions/${updatedPromotion.image}`, () => { });
        } else {
            updateData.image = updatedPromotion.image; // Retain the old image filename
        }
        await promotionModel.findByIdAndUpdate(req.body.id, updateData);
        res.json({ success: true, message: "Promotion updated successfully", promotion: updatedPromotion });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating promotion" });
    }
};


export { getListPromotion, getPromotionById, createPromotion, deletePromotion, updatePromotion };
