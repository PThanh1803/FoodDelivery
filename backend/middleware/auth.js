import jwt from "jsonwebtoken";


const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    console.log("Token: ", token);
    if (!token) {
        return res.json({ success: false, message: "Not authorized. Login again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;

        next();
    } catch (error) {
        console.log(error);
        next().error(error);
    }

}

export default authMiddleware;