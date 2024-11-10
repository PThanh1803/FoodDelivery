// models/Rating.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    userImage: { type: String, required: true },
    userName: { type: String, required: true },
    userID: { type: String, required: true },
    date: { type: Date, default: Date.now },
    star: { type: Number, required: true, min: 1, max: 5 },
    type: { type: String, enum: ['delivery', 'dine-in'], required: true },
    foodRate: { type: Number, min: 1, max: 5 },
    serviceRate: { type: Number, min: 1, max: 5 },
    pictures: [{ type: String }],
    comment: { type: String },
    response: { type: String }
},{timestamps: true});


 const reviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

 export default reviewModel;