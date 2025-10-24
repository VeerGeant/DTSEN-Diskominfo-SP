import express from "express";
import {
  getDocumentsByRequest,
  createDocument,
  deleteDocument,
} from "../../controllers/request/document.controller.js";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js"; // Import middleware

const router = express.Router();

// GET dokumen berdasarkan request_id → Hanya admin & verifikator
router.get("/by-request/:requestId", verifyToken, authorizeRoles("admin", "verifikator"), getDocumentsByRequest);

// POST tambah dokumen → User & Admin
router.post("/", verifyToken, authorizeRoles("user", "admin"), createDocument);

// DELETE hapus dokumen → User, Admin, Verifikator (user akan dicek kepemilikannya di controller)
router.delete("/:id", verifyToken, authorizeRoles("user", "admin", "verifikator"), deleteDocument);

export default router;