import express from "express";
import {
  getDatasetsByRequest,
  createDataset,
} from "../../controllers/request/requestedDataset.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js"; // Import middleware

const router = express.Router();

// GET dataset berdasarkan request_id → Hanya admin & verifikator
router.get("/by-request/:requestId", verifyToken, authorizeRoles("admin", "verifikator"), getDatasetsByRequest);

// POST tambah dataset → User & Admin
router.post("/", verifyToken, authorizeRoles("user", "admin"), createDataset);

export default router;