import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routing ke masing-masing service
app.use("/api/users", createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
}));

app.use("/api/permintaan", createProxyMiddleware({
  target: process.env.PERMINTAAN_SERVICE_URL,
  changeOrigin: true,
}));

app.use("/api/disposisi", createProxyMiddleware({
  target: process.env.DISPOSISI_SERVICE_URL,
  changeOrigin: true,
}));

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "🌐 DTSEN API Gateway is running..." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Gateway running at http://localhost:${PORT}`);
});
