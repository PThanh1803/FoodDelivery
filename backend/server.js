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
import reviewRouter from "./routes/reviewRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

// app config
const app = express();
const port = 4000;

// Create HTTP server from the Express app
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:5173", // Update with your frontend URL
    credentials: true
}));

// Create a new instance of Socket.IO with CORS options
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Update with your frontend URL
        methods: ["GET", "POST" ],
        credentials: true
    }
});

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
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());


// db connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/images/vouchers", express.static("uploads/vouchers"));
app.use("/images/promotions", express.static("uploads/promotions"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter); 
app.use("/api/voucher", voucherRouter);
app.use("/api/promotion", promotionRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);
app.use("/api/notification", notificationRouter(io));

// Default route
app.get("/", (req, res) => {
    res.send("API WORKING");
});

// Start server
server.listen(port, () => 
    console.log(`Server started on http://localhost:${port}`)
);
