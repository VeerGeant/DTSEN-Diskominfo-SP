import express from "express";
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../../controllers/request/request.controller.js";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Rute untuk manajemen permohonan data.
 * Menggunakan middleware auth + role-based access control.
 */

// 🔹 GET semua permohonan → hanya admin yang boleh
router.get("/", verifyToken, authorizeRoles("admin"), getAllRequests);

// 🔹 GET permohonan berdasarkan ID → admin & verifikator boleh
router.get("/:id", verifyToken, authorizeRoles("admin", "verifikator"), getRequestById);

// 🔹 POST buat permohonan baru → user biasa atau admin boleh
router.post("/", verifyToken, authorizeRoles("user", "admin"), createRequest);

// 🔹 PUT update permohonan → hanya admin atau verifikator yang boleh
router.put("/:id", verifyToken, authorizeRoles("admin", "verifikator"), updateRequest);

// 🔹 DELETE hapus permohonan → hanya admin yang boleh
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteRequest);

export default router;
