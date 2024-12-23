import bookingModel from "../models/bookingModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import { createNotification } from "./notificationController.js";

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


const updateBookingStatus = async (req, res) => {
    const { status, cancellationReason } = req.body;
    const bookingId = req.params.id;

    try {
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Xử lý trạng thái hủy hoặc cập nhật trạng thái khác
        if (status === 'cancelled') {
            booking.status = 'cancelled';
            booking.cancellationReason = cancellationReason || 'No reason provided';
        } else {
            booking.status = status;
        }

        await booking.save();
        const user = await userModel.findById(booking.userId);
        const notificationData = {
            userId: booking.userId,
            userName: user ? user.name : "User",
            userImage: user ? user.image : "",
            type: status === 'cancelled' ? 'admin' : 'user',
            category: "booking",
            message: "Booking is " + status, 
            details: {
                bookingId: bookingId
            },
            status: "unread"
        };
      
         await createNotification(global.io, notificationData);

        res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to update booking status to ${status}`,
            error: error.message
        });
        console.error('Error updating booking:', error);
    }
};



// Get bookings by user ID with populated food details, pagination, and sorting
const getBookingByUser = async (req, res) => {
    const userId = req.params.userId;
    const { page = 1, limit = 10, status, date } = req.query;
    const filters = {};
   
    if (status && status !== 'all') filters.status = status;
    if (date) filters.reservationTime = { $gte: new Date(date) };
    console.log(filters.reservationTime);
    filters.userId = userId;
    try {
      const bookings = await bookingModel.find(filters)
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
const getBooking =async (req, res) => {
    const { page = 1, limit = 10, status, date } = req.query;
    const filters = {};
   
    if (status && status !== 'all') filters.status = status;
    if (date) filters.reservationTime = { $gte: new Date(date) };
    console.log(filters.reservationTime);
    try {
      const reservations = await bookingModel.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    
        const reservationsWithFoodDetails = await populateFoodDetails(reservations);
      const totalReservations = await bookingModel.countDocuments(filters);
      const totalPages = Math.ceil(totalReservations / limit);
  
      res.json({
        success: true,
        bookings: reservationsWithFoodDetails,
        totalPages,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
      console.error('Error retrieving reservations:', err);
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

        const user = await userModel.findById(bookingData.userId);
        const notificationData = {
            userId: bookingData.userId,
            userName: user ? user.name : "User",
            userImage: user ? user.image : "",
            type: "admin",
            category: "booking",
            message: "You have a new booking",
            details: {
                bookingId: newBooking._id
            },
            status: "unread"
        };

        await createNotification(global.io, notificationData);

        res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to create booking', error: error.message });
        console.error('Error creating booking:', error);
    }
};


export {
    createBooking,
    getBookingByUser,
    getBooking, updateBookingStatus
};