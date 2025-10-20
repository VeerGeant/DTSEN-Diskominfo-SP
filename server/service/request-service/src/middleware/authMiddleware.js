// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";

// dotenv.config();

// export const verifyToken = (req, res, next) => {
//   try {
//     // Ambil token dari cookie
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized. Token tidak ditemukan di cookie." });
//     }

//     // Verifikasi token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Simpan data user ke req.user
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("JWT Verify Error:", error.message);
//     return res.status(403).json({ error: "Token tidak valid atau sudah expired." });
//   }
// };
// src/middleware/authMiddleware.js
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// export const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader) {
//       return res.status(401).json({ message: "Token tidak ditemukan" });
//     }

//     // Format: "Bearer <token>"
//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Token tidak valid" });
//     }

//     // Verifikasi token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Simpan payload token ke req.user
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Error verifikasi JWT:", error.message);
//     return res.status(403).json({ message: "Token tidak valid atau kadaluarsa" });
//   }
// };
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Cek dari header (opsional, fallback)
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Kalau tidak ada, coba ambil dari cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ Error verifikasi JWT:", error.message);
    return res.status(403).json({ message: "Token tidak valid atau kadaluarsa" });
  }
};
