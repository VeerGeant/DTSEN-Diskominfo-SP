// src/routes/request.routes.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createRequest } from "../controllers/request.controller.js";

const router = express.Router();

// 🔒 Proteksi dengan JWT + upload 3 file PDF
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "surat_permohonan", maxCount: 1 },
    { name: "kak", maxCount: 1 },
    { name: "nda", maxCount: 1 },
  ]),
  createRequest
);

export default router;
