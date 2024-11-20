import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { sendOrderEmail } from "./emailController.js";
import { createNotification } from "./notificationController.js";
import voucherModel from "../models/voucherModel.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order for fontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // Lưu thông tin đơn hàng
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Kiểm tra giảm giá
        const discountAmount = req.body.discount ? req.body.discount * 100 : 0; // Giảm giá (cents)
        const deliveryCharge = 2 * 100; // Phí vận chuyển cố định (200 cents)

        if (discountAmount > 0) {
            // **Trường hợp có giảm giá**: Gộp tất cả vào một dòng duy nhất
            const itemsTotal = req.body.items.reduce(
                (total, item) => total + item.price * 100 * item.quantity,
                0
            );
            const totalAmount = itemsTotal + deliveryCharge - discountAmount;

            // Kiểm tra nếu tổng tiền âm
            if (totalAmount < 0) {
                return res.json({ success: false, message: "Tổng tiền không hợp lệ (dưới 0)" });
            }

            // Tạo line_items với tổng tiền đã giảm
            const line_items = [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Order Total" },
                        unit_amount: totalAmount, // Tổng tiền (cents)
                    },
                    quantity: 1,
                },
            ];

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items,
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&voucherId=${req.body.voucherId}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            });

            return res.json({ success: true, session_url: session.url });
        }
        else {
            // **Trường hợp không có giảm giá**: Tạo từng dòng sản phẩm riêng
            const line_items = req.body.items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: item.price * 100, // Giá từng món (cents)
                },
                quantity: item.quantity,
            }));

            // Thêm phí vận chuyển vào line_items
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: "Delivery Charge" },
                    unit_amount: deliveryCharge,
                },
                quantity: 1,
            });

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items,
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            });

            return res.json({ success: true, session_url: session.url });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "error" });
    }
};






const verifyOrder = async (req, res) => {
    const { voucherId, success, orderId, discount } = req.body;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            const user = await userModel.findById(order.userId);
            console.log(user);
            const voucher = await voucherModel.findById(voucherId);
            if (voucher) {
                voucher.used += 1;
                await voucher.save();
                console.log("Voucher updated successfully " + voucher.used);
            }
            // Notification data
            const notificationData = {
                userId: order.userId,
                userName: user ? user.name : "User",
                userImage: user ? user.image : "",
                type: "admin",
                category: "order",
                message: "A new order has been placed. ",
                details: {
                    orderId: orderId,
                },
                status: "unread"
            };

            // Use global io to emit notification
            await createNotification(global.io, notificationData);

            if (user && user.email) {
                await sendOrderEmail(user.email, 'Processing', order.items);
            }

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
};



const userOrders = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const orders = await orderModel
            .find({ userId: userId })
            .sort({ date: -1 })
            .skip((page - 1) * limit)  // Skip orders of previous pages
            .limit(limit);  // Limit the number of orders

        // Count total matching orders for pagination
        const totalOrders = await orderModel.countDocuments({ userId, payment: true });
        console.log(orders)
        res.json({ success: true, data: orders, totalOrders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "An error occurred while fetching orders." });
    }
};


//listing orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ payment: true }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}

//api for updating order status
const updateStatus = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndUpdate(req.params.orderId, { status: req.body.status });
        // res.json({ success: true, message: "Status updated" });
        console.log(req.body.userID);
        const user = await userModel.findById(order.userId);
        if (user) {
            await sendOrderEmail(user.email, req.body.status);
            const notificationData = {
                userId: order.userId,
                userName: user ? user.name : "User",
                userImage: user ? user.image : "",
                type: "user",
                category: "order",
                message: "Your order has been " + req.body.status,
                details: {
                    orderId: order._id,
                },
                status: "unread"
            };

            // Use global io to emit notification
            await createNotification(global.io, notificationData);
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