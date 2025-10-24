import axios from 'axios';

const BASE_URL = 'http://localhost:4777/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  // ✅ KRITIS: Harus TRUE untuk mengirim dan menerima cookie cross-site
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =========================================================
// 1. REQUEST INTERCEPTOR
// =========================================================
apiClient.interceptors.request.use(
  (config) => {
    // Browser akan otomatis mengirim cookie berkat withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =========================================================
// 2. RESPONSE INTERCEPTOR (FIXED: Mencegah Infinite Loop pada Error 500/Jaringan)
// =========================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cek jika ada response dari server (bukan error jaringan)
    if (error.response) { 
        // Status code dari API response
        const status = error.response.status;
        
        // ⛔ HANYA HAPUS SESI JIKA STATUS ADALAH 401 ATAU 403
        if (status === 401 || status === 403) {
            console.warn(`Akses tidak sah/terlarang (${status}). Membersihkan sesi lokal...`);
            
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("userChanged"));
        } else if (status === 500) {
            // Log error server, tapi JANGAN hapus sesi
            console.error("Internal Server Error (500) detected on API call. Check backend console.");
        }
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        // Ini adalah error jaringan/koneksi ditolak (backend mati/port salah).
        // Kita JANGAN hapus sesi, karena user mungkin masih login, backend yang bermasalah.
        console.error("Network or Connection Refused error. Backend is likely down.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
