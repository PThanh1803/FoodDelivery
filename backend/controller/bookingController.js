import bookingModel from "../models/bookingModel.js";
import foodModel from "../models/foodModel.js";


const populateFoodDetails = async (bookings) => {
    const foodIds = new Set();
    const foodQuantities = {};

    // Collect unique food IDs and count quantities
    bookings.forEach((booking) => {
        booking.preOrderedItems.forEach((item) => {
            if (item.foodId) {
                const foodId = item.foodId.toString();
                foodIds.add(foodId);

                // Count quantity
                if (foodQuantities[foodId]) {
                    foodQuantities[foodId] += item.quantity || 1; // default to 1 if no quantity specified
                } else {
                    foodQuantities[foodId] = item.quantity || 1;
                }
            }
        });
    });

    // Fetch food details for unique food IDs
    const foodList = await foodModel.find({ _id: { $in: Array.from(foodIds) } });

    // Create a mapping of foodId to food details
    const foodDetailsMap = foodList.reduce((acc, food) => {
        acc[food._id.toString()] = {
            ...food.toObject(),
            quantity: foodQuantities[food._id.toString()] || 0, // Include quantity, default to 0 if not found
        };
        return acc;
    }, {});

    // Associate food details with each booking
    const bookingsWithFoodDetails = bookings.map((booking) => {
        const foodDetails = booking.preOrderedItems.map((item) => {
            return foodDetailsMap[item.foodId.toString()] || null;
        }).filter(food => food !== null); // Filter out null entries

        return {
            ...booking.toObject(),
            foodDetails, // Add food details to booking
        };
    });

    return bookingsWithFoodDetails;
};


const cancelBooking = async (req, res) => {
    const { bookingId, cancellationReason } = req.body;

    try {
        // Find the booking by its ID
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update the booking status to 'cancelled'
        booking.status = 'cancelled';
        booking.cancellationReason = cancellationReason; // Store the cancellation reason

        // Save the updated booking
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to cancel booking', 
            error: error.message 
        });
        console.error('Error cancelling booking:', error);
    }
};


// Get bookings by user ID with populated food details, pagination, and sorting
const getBookingByUser = async (req, res) => {
    const { userId } = req.body;
    const { page = 1, limit = 5 } = req.query;
    console.log("page:", page, "limit:", limit);
    try {
        const bookings = await bookingModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Populate food details and associate with bookings
        const bookingsWithFoodDetails = await populateFoodDetails(bookings);

        const totalBookings = await bookingModel.countDocuments({ userId });

        res.status(200).json({
            success: true,
            bookings: bookingsWithFoodDetails, // Use the modified bookings
            currentPage: Number(page),
            totalPages: Math.ceil(totalBookings / limit) || 1,
            totalBookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve bookings',
            error: error.message,
        });
        console.error('Error retrieving bookings:', error);
    }
};



// Get all bookings with populated food details, pagination, and sorting
const getBooking = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const bookings = await bookingModel.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const  bookingsWithFoodDetails  = await populateFoodDetails(bookings);

        const totalBookings = await bookingModel.countDocuments();
        res.status(200).json({
            bookings: bookingsWithFoodDetails,
            listFood: foodList,
            currentPage: Number(page),
            totalPages: Math.ceil(totalBookings / limit),
            totalBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
};

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const bookingData = req.body;
        // Create and save the booking
        console.log("Booking data:", bookingData);
        const newBooking = new bookingModel(bookingData);
        console.log("New booking:", newBooking);
        await newBooking.save();

        res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({success: false, message: error.message || 'Failed to create booking', error: error.message });
        console.error('Error creating booking:', error);
    }
};


export {
    createBooking,
    getBookingByUser,
    getBooking ,cancelBooking};