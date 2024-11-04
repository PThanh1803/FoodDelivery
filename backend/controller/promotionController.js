import promotionModel from "../models/promotionModel.js";
import fs from "fs";

// Lọc khuyến mái
const getListPromotion = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const promotions = await promotionModel.find().skip(skip).limit(parseInt(limit));
        const totalPromotions = await promotionModel.countDocuments();

        res.json({ 
            success: true, 
            promotions,
            totalPromotions,
            totalPages: Math.ceil(totalPromotions / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching promotions" });
    }
};


// Lấy thông tin chi tiết khuyến mãi by id
const getPromotionById = async (req, res) => {
    try {
        console.log("id: ", req.body.id);
        const promotion = await promotionModel.findById(req.body.id);
        
        
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
        fs.unlink(`uploads/promotions/${deletedPromotion.image}`, () => {});
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
        const updatedPromotion = await promotionModel.findById(req.body.id);

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
        }
       
        if (req.file) {
            const image_filename =`${req.file.filename}`;
            updateData.image = image_filename; // Update with new image filename
            fs.unlink(`uploads/promotions/${updatedPromotion.image}`, () => {});
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