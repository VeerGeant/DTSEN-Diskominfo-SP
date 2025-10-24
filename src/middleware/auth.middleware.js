import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware untuk memverifikasi JWT dari cookie dan menyimpan data user di req.user.
 */
export const verifyToken = (req, res, next) => {
  // 1. Prioritaskan mengambil token dari HTTP-only cookie yang bernama 'token'
  const token =
    req.cookies?.token ||
    req.headers["authorization"]?.split(" ")[1]; // Fallback: ambil token dari header (jika ada)

  if (!token) {
    // Jika tidak ada token sama sekali
    return res.status(401).json({ error: "Unauthorized. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ⛔ KRITIS: Konversi role ke huruf kecil untuk konsistensi RBAC di middleware berikutnya
    decoded.role = decoded.role?.toLowerCase(); 
    
    req.user = decoded; // simpan data user (termasuk role yang sudah di-lowercase)
    next();
  } catch (err) {
    // Jika verifikasi gagal (expired, invalid signature)
    return res.status(403).json({ error: "Token tidak valid atau sudah expired." });
  }
};

/**
 * Middleware tambahan untuk Role-Based Access Control.
 * Memeriksa apakah peran pengguna (req.user.role) termasuk dalam allowedRoles.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Cek apakah data user ada dan role sudah terisi
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized: Role not found in token" });
    }

    // Role sudah dijamin lowercase karena diubah di verifyToken
    const userRole = req.user.role; 

    if (!allowedRoles.includes(userRole)) { 
      return res.status(403).json({ 
        error: `Akses ditolak: Role ${req.user.role} tidak diizinkan untuk rute ini` 
      });
    }

    next();
  };
};
