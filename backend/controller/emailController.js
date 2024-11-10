import fetch from 'node-fetch';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
dotenv.config(); // Load environment variables from .env file

const url = "http://localhost:4000";
const generateRandomPassword = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


const sendEmail = async (subject, textBody, htmlBody, toEmail) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: toEmail,
        subject: subject,
        text: textBody,
        html: htmlBody,
    };
    console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD, process.env.WEATHER_API_KEY);

    await transporter.sendMail(mailOptions);
}



const generatePasswordContent = (message) => {
    return `
<div style="font-family: Arial, sans-serif; color: #333; ">
    <div style="background-color: #d35400; padding: 20px; border-radius: 10px; text-align: center;">
        <h2 style="color: #fff; font-size: 24px; margin: 0;">🍲 2T Food - Order Your Favorite Meal at Home!</h2>
        <p style="color: #fff; font-size: 18px; margin-top: 10px;">${message}</p>
    </div>
    <div style="margin: 20px 0; padding: 20px; border-radius: 10px; background-color: #f8f8f8;">
        <h3 style="color: #d35400; text-align: center; font-size: 20px;">Your next meal is just a click away!</h3>
        <p style="color: #555; font-size: 16px; text-align: center;">
            Whether you're craving something sweet, spicy, or savory, we have it all. Place your order now and enjoy our freshly prepared meals delivered right to your door.
        </p>
        <div style="text-align: center; margin-top: 20px;">
            <a href="http://localhost:5173/" style="display: inline-block; padding: 12px 24px; background-color: #d35400; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">Order Now</a>
        </div>
    </div>
    <footer style="margin-top: 20px; text-align: center; color: #777; font-size: 14px;">
        <p>Thank you for choosing <strong>2T Food</strong> for your meals!</p>
        <p>Stay connected with us for the latest updates and exclusive offers.</p>
        <p>
            <a href="https://facebook.com/2TFood" style="color: #d35400; text-decoration: none; margin: 0 5px;">Facebook</a> |
            <a href="https://instagram.com/2TFood" style="color: #d35400; text-decoration: none; margin: 0 5px;">Instagram</a> |
            <a href="https://twitter.com/2TFood" style="color: #d35400; text-decoration: none; margin: 0 5px;">Twitter</a>
        </p>
        <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} 2T Food. All rights reserved.</p>
    </footer>
</div>
  `;
};


const sendPassword = async (req, res) => {
    const subject = 'Your Password Forgot ';
    const email = req.body.email;
    try {

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const password = generateRandomPassword(8);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await userModel.findByIdAndUpdate(user._id, { password: hashPassword });
        const textBody = `Your new password is : ${password}`;
        const htmlBody = generatePasswordContent(`Your new password is: ${password}`);
        try {
            await sendEmail(subject, textBody, htmlBody, email);
            console.log(`Email sent to ${email}`);
            res.json({ success: true, message: 'Email sent successfully' });
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            res.json({ success: false, message: 'Failed to send email' });
        }
    } catch (error) {
        console.error(`Failed to send email to`, error);
        res.json({ success: false, message: 'Failed to send email' });
    }
}

const generateOrderSummary = (items) => {
    let totalAmount = 0;
    let itemsHTML = items.map(item => {
        totalAmount += item.price * item.quantity;
        const image = `https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1562815515627-WUI5RN2UL8UZPT1WLROY/chup-anh-mon-an-nha-hang-chuyen-nghiep-4.jpg`
        return `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="${image}" alt="${item.name}" style="width: 60px; height: 60px; margin-right: 10px; border-radius: 5px;">
                <div>
                    <p style="margin: 0; font-size: 16px; color: #333;"><strong>${item.name}</strong></p>
                    <p style="margin: 0; font-size: 14px; color: #555;">Quantity: ${item.quantity}</p>
                    <p style="margin: 0; font-size: 14px; color: #555;">Price: $${item.price * item.quantity}</p>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d35400; text-align: center;">Cảm ơn bạn đã đặt hàng tại 2T Food!</h2>
            <p style="text-align: center; font-size: 16px;">Đơn hàng của bạn bao gồm:</p>
            <div style="margin: 20px 0; padding: 20px; background-color: #f8f8f8; border-radius: 10px;">
                ${itemsHTML}
                <p style="text-align: left; font-size: 12px; color: #333;">Phí ship: 2$</p>
                <p style="text-align: right; font-size: 16px; font-weight: bold; color: #d35400;">Tổng tiền: $${totalAmount+2}</p>
            </div>
            <p style="text-align: center; font-size: 14px; color: #777;">Chúng tôi sẽ sớm chuẩn bị đơn hàng của bạn và giao đến bạn!</p>
        </div>
    `;
};
const sendOrderEmail = async (userEmail, orderStatus, items = []) => {
    const subject = `Your Order Status Update - 2T Food`;

    let textBody = '';
    let htmlBody = '';

    // Nếu trạng thái là 'Processing', tức là đơn hàng vừa được đặt thành công
    if (orderStatus === 'Processing') {
        textBody = `Your order has been successfully placed and is now processing.`;
        htmlBody = generateOrderSummary(items);  // Hàm đã có để tạo nội dung email

    } else {
        // Nếu trạng thái không phải 'Processing', đó là khi admin cập nhật trạng thái đơn hàng
        textBody = `Your order status has been updated to: ${orderStatus}.`;
        htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #d35400; text-align: center;">Order Status Update</h2>
                <p style="text-align: center; font-size: 16px;">
                    Hello! Your order status is now: <strong>${orderStatus}</strong>.
                </p>
                <div style="margin-top: 20px; padding: 20px; background-color: #f8f8f8; border-radius: 10px;">
                    <p style="font-size: 14px; color: #777; text-align: center;">
                        Thank you for choosing 2T Food. We hope you enjoy your meal!
                    </p>
                </div>
                <footer style="margin-top: 20px; text-align: center; color: #777;">
                    <p>&copy; ${new Date().getFullYear()} 2T Food. All rights reserved.</p>
                </footer>
            </div>
        `;
    }

    try {
        await sendEmail(subject, textBody, htmlBody, userEmail);
        console.log(`Order status email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Failed to send order status email to ${userEmail}:`, error);
    }
};
// Hàm gửi email xác nhận đơn hàng



export { sendPassword, sendOrderEmail };