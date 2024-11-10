import userModel from "../models/userModel.js";

// Add item to user's wishlist
const addToWishlist = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        userData.wishlist.push(req.body.itemId);
        await userData.save();
        res.json({ success: true, message: "Item added to wishlist", wishlist: userData.wishlist });

    } catch (error) {
        console.error("Error adding item to wishlist:", error);
        res.status(500).json({ success: false, message: "Error adding item to wishlist" });
    }
};


// Remove item from user's wishlist
const removeFromWishlist = async (req, res) => {
    const itemId = req.params.id;
    try {

        const userData = await userModel.findById(req.body.userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        userData.wishlist = userData.wishlist.filter(item => item !== itemId);

        await userData.save();

        res.json({ success: true, message: "Item removed from wishlist" });
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        res.status(500).json({ success: false, message: "Error removing item from wishlist" });
    }
};

// Fetch data from user's wishlist
const getWishlistByUser = async (req, res) => {
    const userId = req.params.userId;
    if (userId) {

        try {
            const userData = await userModel.findById(userId);

            res.json({ success: true, wishlist: userData.wishlist });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error fetching wishlist" });
        }
    }
}

export { addToWishlist, removeFromWishlist, getWishlistByUser };
