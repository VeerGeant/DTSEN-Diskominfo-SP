import dotenv from "dotenv";
// import pool from "./config/db.js"; // ❌ Hapus import pool
import app from "./app.js";


dotenv.config();

const PORT = process.env.PORT || 4777;

// ====== TEST DATABASE CONNECTION & START SERVER ======
(async () => {
  try {
    // ❌ Hapus: await pool.query("SELECT NOW()");
    // Koneksi sudah diuji di src/config/db.js
    console.log("✅ PostgreSQL connected successfully (Via Sequelize Init)");
    app.listen(PORT, () => {
      console.log(`🚀 User Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
})();