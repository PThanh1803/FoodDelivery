import reviewModel from "../models/reviewModel.js";
import fs from "fs";
import {createNotification} from "./notificationController.js";


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
        const notificationData = {
            userId: req.body.userID,
            userName: req.body.userName,
            userImage: req.body.userImage,
            type: 'admin',
            category: 'review',
            message: 'A new review has been added',
            details: {
                reviewId: newReview._id,
            },
            status: 'unread'
        }

        await createNotification(global.io, notificationData)

        res.json({ success: true, message: "Review added successfully", review: newReview });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding review" });
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
        const{type} = req.query
        const review = await reviewModel.findById(req.params.id);
        
        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }
        if (type === "response") {
            review.response = req.body.response;
            await review.save();
            const notificationData = {
                userId: review.userID,
                userName: review.userName,
                userImage: review.userImage,
                type: 'user',
                category: 'review',
                message: 'Your review has been responded by admin',
                details: {
                    reviewId: review._id,
                    response: review.response,
                },
                status: 'unread'
            }
            await createNotification(global.io, notificationData)
            res.json({ success: true, message: "Response updated successfully", review });
        }
        else {
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
        }
       
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating review" });
    }
};

// const responseReview = async (req, res) => {
//     const { id } = req.params;
//     const { response } = req.body;

//     try {
//         const review = await reviewModel.findByIdAndUpdate(
//             id,
//             { response },
//             { new: true }
//         );
//         res.json({ success: true, message: 'Response submitted successfully', review });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error submitting response', error: 'Failed to submit response' });
//         console.log(error);
//     }
// }

const getReviews = async (req, res) => {
    const { startDate, endDate, responseStatus, starRating, page = 1, limit = 5, type } = req.query;

    const filters = {};

    const pageNum = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
    const limitNum = Math.max(1, parseInt(limit, 10)); // Ensure limit is at least 1
    // Pagination: skip and limit


    // Date range filter
    if (startDate && endDate) {
        filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Response status filter
    if (responseStatus === 'responded') {
        filters.response = { $exists: true };
    } else if (responseStatus === 'unresponded') {
        filters.response = { $exists: false };
    }

    // Star rating filter
    if (starRating && starRating !== 'all') {
        filters.star = parseInt(starRating, 10);
    }

    try {
        
        if (type === 'good') {
            const goodReviews = await reviewModel
                .find({ star: { $gte: 4 } }) // Chỉ lấy review có số sao từ 4 trở lên
                .sort({ date: -1 }) // Sắp xếp theo ngày mới nhất
                .limit(5); // Giới hạn 5 review
            res.json({
                success: true,
                reviews: goodReviews,
                message: "Successfully fetched good reviews"
            });
            return;
        }
        const reviews = await reviewModel
            .find(filters)
            .sort({ date: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
        const totalReviews = await reviewModel.countDocuments(filters);
        const images = reviews.flatMap(review => review.pictures);
        res.json({
            success: true,
            reviews,
            totalPages: Math.ceil(totalReviews / limitNum || 1),
            images,
            currentPage: pageNum,
        });
        console.log('Reviews fetched successfully :', reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
};


const getReviewStats = async (req, res) => {
    try {
        const totalReviews = await reviewModel.countDocuments();
        const avgStarRating = await reviewModel.aggregate([
            { $group: { _id: null, avgStar: { $avg: "$star" } } }
        ]);

        const starBreakdown = await reviewModel.aggregate([
            { $group: { _id: "$star", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        const avgServiceRating = await reviewModel.aggregate([
            { $match: { serviceRate: { $exists: true } } },
            { $group: { _id: null, avgService: { $avg: "$serviceRate" } } }
        ]);

        const avgFoodRating = await reviewModel.aggregate([
            { $match: { foodRate: { $exists: true } } },
            { $group: { _id: null, avgFood: { $avg: "$foodRate" } } }
        ]);

        res.json({
            success: true,
            totalReviews,
            avgStarRating: avgStarRating[0]?.avgStar || 0,
            starBreakdown,
            avgServiceRating: avgServiceRating[0]?.avgService || 0,
            avgFoodRating: avgFoodRating[0]?.avgFood || 0,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
        console.log(error);
    }
}

export { addReview, getReviews, deleteReview, updateReview, getReviewStats };