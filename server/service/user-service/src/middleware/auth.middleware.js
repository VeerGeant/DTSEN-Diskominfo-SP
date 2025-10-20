import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // ambil dari cookie
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user ke request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token tidak valid atau sudah expired." });
  }
};
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Tidak ada token, silakan login" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token tidak valid atau kedaluwarsa" });
  }
};
