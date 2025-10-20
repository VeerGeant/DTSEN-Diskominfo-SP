import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import requestRoutes from "./routes/request.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Request-service running on port ${PORT}`);
});
