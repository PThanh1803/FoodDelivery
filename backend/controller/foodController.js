import foodModel from "../models/foodModel.js";
import fs from "fs";


//add food item

const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" })
    }
}

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" })
    }
}

//remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        fs.unlink(`uploads/${food.image}`, () => { });
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "food removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" })
    }
}

const updateFood = async (req, res) => {
    try {
        // Fetch the food item from the database to get the current image
        const foodItem = await foodModel.findById(req.params.id);

        // Check if the food item exists
        if (!foodItem) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Prepare the update data
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
        };

        // Check if a new image has been uploaded
        if (req.file) {
            const image_filename = `${req.file.filename}`;
            updateData.image = image_filename; // Update with new image filename
        } else {
            updateData.image = foodItem.image; // Retain the old image filename
        }

        await foodModel.findByIdAndUpdate(req.params.id, updateData);
        console.log("Food updated successfully");
        res.json({ success: true, message: "Food updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food item" });
    }
}
// New function: Get food by ID
const getFoodById = async (ids) => {
    try {
        const foods = await foodModel.find({ _id: { $in: ids } });

        return foods;
    } catch (error) {
        console.log(error);
        throw new Error("Error retrieving food items by IDs");
    }
};

// Example usage of getFoodById in topseller route
const topSeller = async (req, res) => {
    try {
        const foodIds = Array.isArray(req.query.ids) ? req.query.ids : req.query.ids.split(',');
        // Handle array or string
        const foods = await getFoodById(foodIds);

        if (foods.length > 0) { // Check if there are any foods returned
            res.json({ success: true, data: foods });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error retrieving top seller" });
    }
};

export { addFood, listFood, removeFood, updateFood, topSeller };