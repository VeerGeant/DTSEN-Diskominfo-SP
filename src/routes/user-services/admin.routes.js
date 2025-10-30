import express from "express";
import { User } from "../../models/index.js"; // ✅ Import model User
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware.js"; // ✅ Import authorizeRoles
import { getAllRequests } from "../../controllers/request/request.controller.js"; // ✅ Import controller

const router = express.Router();

// ✅ Approve atau deactivate user
router.put("/users/:id/status", verifyToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ error: "Access denied: Only admin can update user status" });
    }

    const { id } = req.params;
    const { status } = req.body; // 'active' / 'inactive'

    const allowedStatuses = ["active", "inactive"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // ✅ Update status menggunakan Sequelize
    const [updatedRows] = await User.update(
      { status: status },
      { where: { id: id } }
    );

    if (updatedRows === 0) {
      // Cek apakah user memang tidak ada
      const userCheck = await User.findByPk(id);
      if (!userCheck) {
        return res.status(404).json({ error: "User not found" });
      }
      // Jika updatedRows 0 tapi user ada, statusnya mungkin sudah sesuai.
      // Namun, kita tetap ambil data terbaru untuk dikembalikan.
    }
    
    // ✅ Ambil data user yang baru diperbarui
    const updatedUser = await User.findByPk(id, {
      attributes: ["id", "nama", "email", "status", "role"],
    });
    
    // Safety check lagi, mungkin saja updateRows === 0 karena tidak ada perubahan
    if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
    }


    res.status(200).json({
      message: `User ${status === "active" ? "approved" : "deactivated"} successfully`,
      user: updatedUser, // Mengembalikan objek Sequelize
    });
  } catch (error) {
    // Log error lengkap di server
    console.error("🚨 Update status error:", error); 
    res.status(500).json({ error: "Failed to update user status" });
  }
});


// 🆕 ROUTE BARU: GET semua permohonan untuk Admin/Superadmin (Dashboard Verifikasi Tahapan)
// Endpoint: GET /api/admin/verifikasi-tahapan
router.get(
    "/verifikasi-tahapan",
    verifyToken,
    authorizeRoles("admin", "superadmin"), // Hanya admin/superadmin yang bisa mengakses
    getAllRequests // Controller sudah memiliki logic untuk mengambil semua data jika role adalah admin
);


export default router;