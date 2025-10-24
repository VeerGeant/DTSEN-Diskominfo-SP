import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { getCurrentUser } from "../utils/auth"; // Untuk mendapatkan data user

// Fungsi helper untuk memetakan status backend ke status frontend
const mapStatus = (backendStatus) => {
  // Status yang menunjukkan perlunya tindakan validasi atau proses persetujuan
  if (["verifikasi_teknis", "verifikasi_substansi", "koordinator"].includes(backendStatus)) {
    return "validasi"; // Badge warna biru (Status: Validasi)
  }
  // Status lainnya (dikirim, pengolahan_data, unduh_data, selesai, dll.)
  return "proses"; // Badge warna abu-abu (Status: Proses)
};

// Fungsi helper untuk memformat timestamp (untuk Tanggal)
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const dateObject = new Date(timestamp);
    if (isNaN(dateObject.getTime())) {
        return 'N/A';
    }
    return dateObject.toLocaleDateString('id-ID', {
        day: '2-digit', 
        month: 'short', 
        year: 'numeric'
    }).replace(/\./g, ''); 
};


export default function Pengajuan() {
  const navigate = useNavigate();
  const user = getCurrentUser(); // Ambil data user yang sedang login
  
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRequests = async () => {
      // ⛔ CEK SESI KRITIS: Jika user tidak ada, set error dan JANGAN panggil API.
      if (!user) {
        setLoading(false);
        setError("Anda belum login atau sesi Anda kedaluwarsa. Silakan login kembali.");
        return;
      }

      try {
        setLoading(true);
        // Memanggil endpoint request. Backend sudah mengizinkan role 'user' dan memfilter data.
        const response = await apiClient.get("/request/requests"); 
        
        const formattedData = response.data.data.map(item => ({
            id: item.id,
            // Menggabungkan tema data yang diminta
            nama: item.requested_datasets?.map(d => d.tema_data).join(', ') || item.tema_data || "Permohonan Data",
            // Tanggal diambil dari created_at (atau fallback)
            tanggal: formatTimestamp(item.created_at || item.tanggal_pengajuan), 
            status: mapStatus(item.status), // Mapping status
        }));
        
        setPengajuan(formattedData);
        setError(null);

      } catch (err) {
        console.error("Error fetching user requests:", err.response || err);
        // Pesan error jika API gagal
        setError("Gagal memuat riwayat pengajuan. Pastikan server DTSEN berjalan dan Anda sudah login.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, [user]); 
  
  // Arahkan ke halaman tambah permohonan
  const handleAddPengajuan = () => {
    navigate("/admin/tambah-permohonan");
  };

  // --- Render Status ---
  if (loading) {
    return (
      <div className="pengajuan-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h1 className="header-section">Memuat Riwayat Pengajuan...</h1>
      </div>
    );
  }
  
  if (error) {
    // Tampilan error yang stabil
    return (
      <div className="pengajuan-container">
        <div className="header-section">
          <h1>Pengajuan Data</h1>
          {user && <button className="add-btn" onClick={handleAddPengajuan}>+ Tambah Pengajuan</button>}
        </div>
        <div className="list-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="pengajuan-container">
        
        {/* Dokumen Persyaratan */}
        <div className="dokumen-persyaratan">
          <div className="dokumen-content">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
              alt="Ilustrasi Dokumen"
              className="dokumen-img"
            />
            <button className="persyaratan-btn">📄 Dokumen Persyaratan</button>
          </div>
        </div>

      
        <div className="header-section">
          <h1>Pengajuan Data</h1>
          <button className="add-btn" onClick={handleAddPengajuan}>
            + Tambah Pengajuan
          </button>
        </div>

      
        <div className="list-container">
          {pengajuan.length > 0 ? (
            pengajuan.map((item) => (
              <div key={item.id} className="pengajuan-card">
                <div className="pengajuan-info">
                  <h3>{item.nama}</h3>
                  <p>{item.tanggal}</p>
                </div>
                <div
                  className={`status-badge ${item.status}`}
                >
                  {item.status === "validasi" ? "Validasi" : "Proses"}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <svg
                className="empty-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h18M3 12h18m-9 5h9"
                />
                </svg>
                <p>Belum ada pengajuan. Klik tombol di atas untuk membuat pengajuan baru.</p>
            </div>
          )}
        </div>
      </div>
    );
  }