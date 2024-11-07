import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { sendOrderEmail } from "./emailController.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order for fontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity
            }
        })


        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: line_items,
            success_url: frontend_url + `/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        const user = await userModel.findById(req.body.userId);
        if (user && user.email) {
            await sendOrderEmail(user.email, 'Processing', req.body.items);
        }
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });

    }
}


const verifyOrder = async (req, res) => {
    const { success, orderId } = req.body;

    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            console.log("paid");
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }

}


//user order for frontend 
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}


//listing orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}

//api for updating order status
const updateStatus = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        // res.json({ success: true, message: "Status updated" });
        console.log(req.body.userID);
        const user = await userModel.findById(order.userId);
        if (user) {
            await sendOrderEmail(user.email, req.body.status);
        }
        res.json({ success: true, message: "Status updated and email sent" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}
const getTopSellingItems = async (req, res) => {
    try {
        // Aggregate to count item occurrences in paid and delivered orders
        const topItems = await orderModel.aggregate([
            {
                $match: { status: "Delivered", payment: true }
            },
            {
                $unwind: "$items" // Unwind items to count each item separately
            },
            {
                $group: {
                    _id: "$items._id",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            {
                $sort: { totalSold: -1 }
            },
            {
                $limit: 4
            },
            {
                $project: {
                    itemId: "$_id",
                    totalSold: 1
                }
            }
        ]);

        res.json({ success: true, topItems });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching top items" });
    }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getTopSellingItems };