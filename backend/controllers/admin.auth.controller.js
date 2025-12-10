import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
    const { role } = req.user;
    const isAdmin = role === "admin";

    // Authorization check: check if user is admin
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Access denied!"
        })
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;


        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit);
        
        const totalUsers = await User.countDocuments();
        
        return res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit)
            }
        })
    } catch (error) {
        console.log("Error fetching users", error);
        return res.status(500).json({
            success: false, 
            message: "error fetching users", 
            error
        })
    }


}