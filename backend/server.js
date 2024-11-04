import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import http from 'http'; // Import http
import { Server } from 'socket.io'; // Import Socket.IO
import voucherRouter from "./routes/voucherRoute.js";
import promotionRouter from "./routes/promotionRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
//app config
const app = express();
const port = 4000;

// Create HTTP server from the Express app
const server = http.createServer(app);

// Create a new instance of Socket.IO
const io = new Server(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle notification sending
    socket.on('sendNotification', (notification) => {
        // Emit the notification to all connected clients
        io.emit('newNotification', notification);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

//middlewares
app.use(express.json());
app.use(cors());

// db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/images/vouchers", express.static("uploads/vouchers"));
app.use("/images/promotions", express.static("uploads/promotions"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter); 
app.use("/api/voucher",voucherRouter)
app.use("/api/promotion",promotionRouter)
app.use("/api/booking",bookingRouter)

//api routes
app.get("/", (req, res) => {
    res.send("API WORKING");
});

//listen
server.listen(port, () => 
    console.log(`Server started on http://localhost:${port}`));
