import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/auth.middleware.js";

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

    const result = await pool.query(
      "UPDATE users SET status = $1 WHERE id = $2 RETURNING id, nama, email, status",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: `User ${status === "active" ? "approved" : "deactivated"} successfully`,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update status error:", error.message);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

export default router;
