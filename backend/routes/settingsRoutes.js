import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import authMiddleware from '../middleware/auth.js';

const settingsRouter = express.Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", authMiddleware, updateSettings);

export default settingsRouter; 