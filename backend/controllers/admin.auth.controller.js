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

export const deleteUser = async (req, res) => {
    const { role } = req.user;
    const isAdmin = role === "admin";

    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        })
    }

    const { id } = req.params;

    try {
        // check if user is current admin: to prevent admin from deleting themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account."
            })
        }

        // delete user
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deleteUser) {
            return res.status(404).json({
                success: false,
                message: "user not found."
            })
        }

        return res.status(200).json({
            success: true,
            message: "user deleted successfully."
        })
    } catch (error) {
        console.log("Error deleting user",error);
        return res.status(500).json({
            success: false,
            message: "error deleting user",
            error: error.message
        })
    }
}