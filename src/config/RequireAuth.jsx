// src/config/RequireAuth.jsx (Implementasi RBAC yang lengkap)

import { Navigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from "../utils/auth"; 

export default function RequireAuth({ children, allowedRoles }) {
  // 1. Ambil user dan cek status login
  const user = getCurrentUser(); 
  const isAuthenticated = isLoggedIn(); 

  // 2. Jika tidak terautentikasi 
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />; 
  }

  // 3. Logika pengecekan Role-Based Access Control (RBAC)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika peran tidak diizinkan, arahkan ke beranda (/)
    return <Navigate to="/" replace />;
  }

  // Jika otentikasi dan otorisasi berhasil, tampilkan konten
  return children;
}