
import express from "express";
import { registerWebhook, getWebhookLogs } from "../controllers/WebhookManagementController";
const router = express.Router();

// Webhook registration (W1)
router.post("/register", registerWebhook);

// Webhook log viewing (W4)
router.get("/logs/:merchantId", getWebhookLogs);

export default router;
