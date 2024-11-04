import promotionModel from "../models/promotionModel.js";


// Lọc khuyến mái
const getListPromotion = async (req, res) => {
    try {
        const promotions = await promotionModel.find();
        res.json({ success: true, promotions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching promotions" });
    }
};
const getActivePromotions = async (req, res) => {
    try {
        const currentDate = new Date(); // Thời gian hiện tại
        const promotions = await promotionModel.find({
            expiryDate: { $gt: currentDate },  // Chỉ lấy những promotion có expiryDate lớn hơn thời gian hiện tại
            status: "active"  // Chỉ lấy những promotion có trạng thái là "active"
        });

        res.json({ success: true, promotions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching active promotions" });
    }
};
// Lấy thông tin chi tiết khuyến mãi by id
const getPromotionById = async (req, res) => {
    try {
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
        fs.unlink(`uploads/${deletedPromotion.image}`, () => { });
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
            dateCreated: Date.now(),
        }

        if (req.file) {
            const image_filename = `${req.file.filename}`;
            updateData.image = image_filename; // Update with new image filename
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

export { getListPromotion, getPromotionById, createPromotion, deletePromotion, updatePromotion, getActivePromotions };
