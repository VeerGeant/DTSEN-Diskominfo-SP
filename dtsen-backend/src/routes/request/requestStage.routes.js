import express from "express";
import {
  getStagesByRequest,
  updateStageStatus,
} from "../../controllers/request/requestStage.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js"; // Import middleware

const router = express.Router();

// GET semua tahapan berdasarkan request_id → Hanya admin & verifikator
router.get("/by-request/:requestId", verifyToken, authorizeRoles("admin", "verifikator"), getStagesByRequest);

// PUT update status tahapan tertentu → Hanya admin & verifikator (Aksi proses bisnis)
router.put("/:id", verifyToken, authorizeRoles("admin", "verifikator"), updateStageStatus);

export default router;