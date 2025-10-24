import apiClient from '../api/apiClient';

const USER_STORAGE_KEY = "user";

// --- FUNGSI AUTH API ---

// Step 1: Kirim email/password untuk meminta OTP
export async function requestLoginOtp(email, password) {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { 
        success: false, 
        message: error.response?.data?.error || "Gagal meminta OTP. Cek email dan password." 
    };
  }
}

// Step 2: Verifikasi OTP dan set sesi (cookie)
export async function verifyOtpAndLogin(email, otp_code) {
  try {
    // Permintaan ini akan membuat backend menyetel cookie otentikasi HTTP-only
    const response = await apiClient.post("/auth/verify-otp", { email, otp_code });
    const user = response.data.user;
    
    // ✅ KRITIS: Hanya simpan data user. Token dipegang oleh cookie (httpOnly).
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("userChanged"));
    
    return { success: true, user };
  } catch (error) {
    return { 
        success: false, 
        message: error.response?.data?.error || "Verifikasi OTP gagal." 
    };
  }
}

// Pendaftaran (Registrasi)
export async function registerUser(data) {
    try {
        const response = await apiClient.post("/auth/register", data);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.error || "Pendaftaran gagal." 
        };
    }
}

// Logout
export async function logoutUser() {
  try {
    // Panggil backend untuk menghapus cookie
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout API call failed, but clearing local state:", error);
  } finally {
    localStorage.removeItem(USER_STORAGE_KEY);
    window.dispatchEvent(new Event("userChanged"));
  }
}

// --- FUNGSI UTILITY ---

export function getCurrentUser() {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem(USER_STORAGE_KEY);
}