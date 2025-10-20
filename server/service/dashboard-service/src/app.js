import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);

app.get("/ping", (req, res) => res.send("pong"));

export default app;
