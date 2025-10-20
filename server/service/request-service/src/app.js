import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import requestRoutes from "./routes/request.routes.js";

const app = express();

// ✅ Izinkan cookie dikirim dari frontend React
app.use(cors({
  origin: "http://localhost:3000", // ganti sesuai port React kamu
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Route utama
app.use("/api/requests", requestRoutes);

export default app;
