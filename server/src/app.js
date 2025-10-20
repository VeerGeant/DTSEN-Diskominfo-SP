// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routing sederhana
app.get("/", (req, res) => {
  res.json({ message: "DTSEN backend API is running 🚀" });
});

export default app;
