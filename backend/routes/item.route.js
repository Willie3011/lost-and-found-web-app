import express from 'express';
import { createItem, deleteItem, getItemById, getItems, updateItem } from '../controllers/item.controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/items", getItems);
router.get("/items/:id", getItemById);
router.post("/items", authenticateUser , createItem);
router.put("/items/:id",authenticateUser, updateItem);
router.delete("/items/:id",authenticateUser, deleteItem);

export default router;