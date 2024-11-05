import reviewModel from "../models/reviewModel.js";
import fs from "fs";



//add review
const addReview = async (req, res) => {
    try {
        const newReview = new reviewModel({
            userImage: req.body.userImage,
            userID: req.body.userID,
            userName: req.body.userName,
            date: req.body.date,
            star: req.body.star,
            type: req.body.type,
            foodRate: req.body.foodRate,
            serviceRate: req.body.serviceRate,
            comment: req.body.comment,
            response: req.body.response,
            pictures: [] // Initialize pictures array
        });

        // Check if there are files uploaded
        if (req.files) {
            // Loop through each file and push the filename to the pictures array
            req.files.forEach(file => {
                newReview.pictures.push(file.filename);
            });
        }

        await newReview.save();
        res.json({ success: true, message: "Review added successfully", review: newReview });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding review" });
    }
};

// In reviewController.js

const getReviews = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;

        // Convert page and limit to numbers
        const pageNum = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
        const limitNum = Math.max(1, parseInt(limit, 10)); // Ensure limit is at least 1

        const totalReviews = await reviewModel.countDocuments();
        const totalPages = Math.ceil(totalReviews / limitNum);

        // Fetch reviews with pagination
        const reviews = await reviewModel
            .find()
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        // Collect all images from the reviews
        const images = reviews.flatMap(review => review.pictures);

        res.json({
            success: true,
            reviews,
            images, // List of all images in the current set of reviews
            currentPage: pageNum,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
    }
};



const deleteReview = async (req, res) => {
    try {
        const review = await reviewModel.findById(req.params.id);

        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }
        review.pictures.forEach(async (picture) => {
            fs.unlink(`uploads/reviews/${picture}`, () => { });
        })
        await reviewModel.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting review" });
    }
};

const updateReview = async (req, res) => {
    try {
        const review = await reviewModel.findById(req.params.id);
        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }
        review.userImage = req.body.userImage;
        review.userName = req.body.userName;
        review.userID = req.body.userID;
        review.date = req.body.date;
        review.star = req.body.star;
        review.type = req.body.type;
        review.foodRate = req.body.foodRate;
        review.serviceRate = req.body.serviceRate;
        review.comment = req.body.comment;
        review.response = req.body.response;
        await review.save();
        res.json({ success: true, message: "Review updated successfully", review });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating review" });
    }
};
const getGoodReview = async (req, res) => {
    try {
        // Lấy 5 review gần đây nhất có số sao là 4 hoặc 5
        const goodReviews = await reviewModel
            .find({ star: { $gte: 4 } }) // Chỉ lấy review có số sao từ 4 trở lên
            .sort({ date: -1 }) // Sắp xếp theo ngày mới nhất
            .limit(5); // Giới hạn 5 review

        res.json({
            success: true,
            reviews: goodReviews,
            message: "Successfully fetched good reviews"
        });
    } catch (error) {
        console.error("Error fetching good reviews:", error);
        res.status(500).json({ success: false, message: "Error fetching good reviews", error: error.message });
    }
};

export { addReview, getReviews, deleteReview, updateReview, getGoodReview };