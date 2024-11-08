import userModel from "../models/userModel.js";

//add itemto user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = await userData.cartData;

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });
        res.json({ success: true, message: "Item added to cart" });

        //add food item to cart
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}


//remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = await userData.cartData;
        if (!cartData[req.params.id]) {
            return res.json({ success: false, message: "Item not found in cart" });
        } else if (cartData[req.params.id] > 0) {
            cartData[req.params.id] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });

    }
}


//fetch data from user cart
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addToCart, removeFromCart, getCart }