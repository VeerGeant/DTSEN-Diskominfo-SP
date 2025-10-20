import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import pool from "../config/db.js";

// Import controller yang sudah dipisah
import registerUser from "../controllers/user/registerUser.js";
import getAllUsers from "../controllers/user/getAllUsers.js";
import getProfile from "../controllers/user/getProfile.js";

const router = express.Router();

// 🧾 Register user baru
router.post("/register", registerUser);

// 👥 Get all users (admin/superadmin only)
router.get("/all", verifyToken, getAllUsers);

// 👤 Get profile user (harus login dan hanya bisa lihat diri sendiri)
router.get("/:id", verifyToken, getProfile);


export default router;