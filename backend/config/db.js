import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://PhamThanh:1803@cluster0.xwtuwix.mongodb.net/HotPot').then(()=>console.log('DB connected'))
}