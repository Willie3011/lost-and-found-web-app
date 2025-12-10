import { authenticateUser } from "../middleware/authMiddleware.js";
import express from "express";
import { getUsers } from "../controllers/admin.auth.controller.js";

const router = express.Router();

router.get("/admin/users", authenticateUser, getUsers);


export default router;