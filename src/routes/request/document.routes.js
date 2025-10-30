import express from "express";
import {
  getDocumentsByRequest,
  createDocument,
  deleteDocument,
  getDocumentFileById // ✅ Pastikan fungsi baru ini diimpor
} from "../../controllers/request/document.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js"; // Import middleware

const router = express.Router();

// ✅ ROUTE BARU: GET detail file dokumen (dengan file_data)
// Roles: admin, superadmin, user (Untuk Read-Only Monitoring)
router.get("/:id/file", verifyToken, authorizeRoles("admin", "superadmin", "user"), getDocumentFileById); 

// GET dokumen berdasarkan request_id → admin, superadmin, & user boleh
router.get("/by-request/:requestId", verifyToken, authorizeRoles("admin", "superadmin", "user"), getDocumentsByRequest); 

// POST tambah dokumen → User, Admin, & Superadmin
router.post("/", verifyToken, authorizeRoles("user", "admin", "superadmin"), createDocument);

// DELETE hapus dokumen → User, Admin, & Superadmin
// (user akan dicek kepemilikannya di controller)
router.delete("/:id", verifyToken, authorizeRoles("user", "admin", "superadmin"), deleteDocument);

export default router;