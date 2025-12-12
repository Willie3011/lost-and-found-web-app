import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
    try {
        // Check if token exists
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            })
        }
    
        //Extract token
        const token = authHeader.split(" ")[1];
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        //find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or no longer exists."
            })
        }

        //attach user to request 
        req.user = user

        next();
    } catch (error) {
        console.log("Auth middleware error: ", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

