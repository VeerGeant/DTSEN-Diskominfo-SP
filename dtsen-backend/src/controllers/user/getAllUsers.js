import pool from "../../config/db.js";

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ error: "Access denied: only admin or superadmin can access this" });
    }

    const result = await pool.query("SELECT id, nama, email, role, status FROM users ORDER BY id ASC");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllUsers;