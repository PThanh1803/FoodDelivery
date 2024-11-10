import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    firstName: {
        type: String,

    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "",
    },
    wishlist: {
        type: [String],
        default: [],
    },
    cartData: {
        type: Object,
        default: {}
    },
    address: {
        type: [
            {
                email: { type: String, },
                street: { type: String, },
                city: { type: String, },
                state: { type: String },
                zipCode: { type: String },
                country: { type: String },
                phone: { type: String },
            }
        ],
        default: []
    }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;