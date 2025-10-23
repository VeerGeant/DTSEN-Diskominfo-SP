import dotenv from "dotenv";
import pool from "./config/db.js";
import app from "./app.js";


dotenv.config();

const PORT = process.env.PORT || 4777;

// ====== TEST DATABASE CONNECTION & START SERVER ======
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 User Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();
