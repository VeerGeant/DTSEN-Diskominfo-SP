import { User } from "../../models/index.js"; // ✅ Import Model User

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ error: "Access denied: only admin or superadmin can access this" });
    }

    // 🔄 Ganti pool.query dengan User.findAll
    const users = await User.findAll({
      attributes: ["id", "nama", "email", "role", "status"], // Pilih kolom yang dibutuhkan
      order: [["id", "ASC"]],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllUsers;