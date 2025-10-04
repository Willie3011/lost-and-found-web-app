import express from 'express';
import { createItem, deleteItem, getItemById, getItems, updateItem } from '../controllers/item.controller.js';

const router = express.Router();

router.get("/items", getItems);
router.post("/items", createItem);
router.get("/items/:id", getItemById);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

export default router;