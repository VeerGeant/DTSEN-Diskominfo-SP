import express from "express";
import { getAllUsers } from "../controllers/dashboard.controller.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Endpoint untuk admin melihat semua user
router.get("/users", verifyAdmin, getAllUsers);

export default router;
