import cron from "node-cron";
import pool from "../config/db.js";

// Jalankan setiap hari jam 00:00
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await pool.query(
      "DELETE FROM blacklisted_tokens WHERE expires_at < NOW()"
    );
    console.log(`🧹 Token cleanup: ${result.rowCount} expired tokens deleted.`);
  } catch (error) {
    console.error("🚨 Error during token cleanup:", error.message);
  }
});

console.log("⏰ Scheduled job: Token cleanup running every midnight");
