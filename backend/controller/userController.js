import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = createToken(user._id);
        res.json({
            success: true, token, user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                address: user.address

            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });

    }

}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//register user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const exist = await userModel.findOne({ email });
        //check if user already exist
        if (exist) {
            return res.json({ success: false, message: "User already exist" });
        }
        // validate email format and password 
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password not strong enough" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ firstName: firstName, lastName: lastName, email: email, password: hashPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, data: token });
    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}
// get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error retrieving user" });
    }
};
const updateUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        const { firstName, lastName, currentPassword, newPassword, avatar, address } = req.body.userData;
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        // Kiểm tra mật khẩu hiện tại
        if (currentPassword && newPassword) {
            // So sánh mật khẩu hiện tại với mật khẩu trong cơ sở dữ liệu
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ success: false, message: "Current password is incorrect" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashPassword;
        }
        if (avatar) user.avatar = avatar;
        if (address) user.address = address;
        // Lưu các thay đổi vào cơ sở dữ liệu
        const updatedUser = await user.save();

        // Trả về thông tin người dùng đã cập nhật
        res.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Error updating user" });
    }
};

export { loginUser, registerUser, getUserById, updateUserById };