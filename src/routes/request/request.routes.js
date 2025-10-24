// src/routes/request/request.routes.js (MODIFIED)

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
 */

// 🔹 GET semua permohonan -> Sekarang USER boleh, karena controller sudah memfilternya
router.get("/", verifyToken, authorizeRoles("admin", "user"), getAllRequests); // <--- PERUBAHAN DI SINI

// 🔹 GET permohonan berdasarkan ID -> admin & verifikator boleh (tidak diubah)
router.get("/:id", verifyToken, authorizeRoles("admin", "verifikator"), getRequestById);

// 🔹 POST buat permohonan baru -> user biasa atau admin boleh (sudah benar)
router.post("/", verifyToken, authorizeRoles("user", "admin"), createRequest);

// 🔹 PUT update permohonan -> hanya admin atau verifikator yang boleh (tidak diubah)
router.put("/:id", verifyToken, authorizeRoles("admin", "verifikator"), updateRequest);

// 🔹 DELETE hapus permohonan -> hanya admin yang boleh (tidak diubah)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteRequest);

export default router;