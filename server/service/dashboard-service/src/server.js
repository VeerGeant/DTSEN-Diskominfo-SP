// =======================
// 1️⃣ Load dotenv dulu
// =======================
import dotenv from "dotenv";
import path from "path";

// Load .env dari root project
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Debug: cek apakah JWT_SECRET terbaca
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// =======================
// 2️⃣ Import dependencies lain
// =======================
import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { verifyAdmin } from "./middleware/auth.middleware.js";

// =======================
// 3️⃣ Setup express
// =======================
const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// =======================
// 4️⃣ Routes
// =======================
app.use("/api/dashboard", dashboardRoutes);

// =======================
// 5️⃣ Jalankan server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Dashboard Service running at http://localhost:${PORT}`);
});
