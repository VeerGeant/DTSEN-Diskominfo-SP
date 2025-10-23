import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Middleware untuk verifikasi JWT
export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers["authorization"]?.split(" ")[1]; // ambil token dari cookie / header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user ke request object
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token tidak valid atau sudah expired." });
  }
};

// ✅ Middleware tambahan untuk Role-Based Access Control
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Akses ditolak: Role tidak diizinkan" });
    }

    next();
  };
};
