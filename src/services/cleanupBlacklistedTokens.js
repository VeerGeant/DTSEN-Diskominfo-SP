import cron from "node-cron";
import models from "../models/index.js"; // Import models
import { Op } from "sequelize"; // Import Operator untuk WHERE clause

// Dapatkan model BlacklistedToken
const { BlacklistedToken } = models;

// Jalankan setiap hari jam 00:00
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await BlacklistedToken.destroy({
      where: {
        expires_at: {
          // Ganti 'WHERE expires_at < NOW()' dengan Sequelize
          [Op.lt]: new Date(), 
        },
      },
    });
    // result adalah jumlah baris yang dihapus
    console.log(`🧹 Token cleanup: ${result} expired tokens deleted.`);
  } catch (error) {
    console.error("🚨 Error during token cleanup:", error.message);
  }
});

console.log("⏰ Scheduled job: Token cleanup running every midnight");