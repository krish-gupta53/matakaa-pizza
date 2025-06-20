import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.get("/admin", authMiddleware, listOrders);
orderRouter.post("/admin/status", authMiddleware, updateStatus);

// User routes
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);

export default orderRouter;