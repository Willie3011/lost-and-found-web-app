export const requireAdmin = (req, res, next) => {
    try {
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please log in."
            })
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: admin access required."
            })
        }

        next();
    } catch (error) {
        console.log("Error in requireAdmin middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in admin middleware"
        })
    }
}