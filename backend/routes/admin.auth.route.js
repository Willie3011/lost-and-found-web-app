import { authenticateUser } from "../middleware/authMiddleware.js";
import express from "express";
import { deleteUser, getUsers } from "../controllers/admin.auth.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/admin/users", authenticateUser, requireAdmin, getUsers);
router.delete("/admin/users/:id", authenticateUser, requireAdmin, deleteUser)


export default router;