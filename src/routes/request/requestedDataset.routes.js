import express from "express";
import {
  getDatasetsByRequest,
  createDataset,
  updateDatasetVersion, // ✅ Import fungsi baru
} from "../../controllers/request/requestedDataset.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js"; // Import middleware

const router = express.Router();

// GET dataset berdasarkan request_id → Hanya admin, superadmin, & verifikator
router.get("/by-request/:requestId", verifyToken, authorizeRoles("admin", "superadmin"), getDatasetsByRequest);

// POST tambah dataset → User & Admin
router.post("/", verifyToken, authorizeRoles("user", "admin", "superadmin"), createDataset);

// ✅ ROUTE BARU: PUT update versi dataset → Hanya Admin/Superadmin
router.put("/:id/version", verifyToken, authorizeRoles("admin", "superadmin"), updateDatasetVersion); 

export default router;
