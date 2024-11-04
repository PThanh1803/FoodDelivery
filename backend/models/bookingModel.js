import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    reservationTime: {
        type: Date,
        required: true,
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1,
    },
    notes: {
        type: String,
    },
    preOrderedItems: {
        type: [
            {
                foodId: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        default: [], 
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    cancellationReason: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


const bookingModel = mongoose.models.booking || mongoose.model("booking", BookingSchema);
export default bookingModel