import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth'; 

// Import komponen tabel yang akan digunakan
import PermohonanAksesData from "../admin/PermohonanAksesData";
import CekTahapanDokumen from "../admin/CekTahapanDokumen";

// Import CSS
import '../styles/dashboard.css'; 
import '../styles/aksesData.css'; 
import '../styles/cekTahapanDok.css'; 


// Komponen Kartu Ringkasan Sederhana (Mock Data)
const SummaryCard = ({ title, value, color }) => (
    <div className="card" style={{ backgroundColor: color, color: color === '#ffc107' ? '#333' : 'white' }}>
        <h3>{title}</h3>
        <p>{value}</p>
    </div>
);


export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('permohonan'); 

  // Data Mock untuk ringkasan (Harusnya diambil dari API)
  const summaryData = {
    totalPengajuan: 13, 
    pengajuanDiproses: 5,
    pengajuanSelesai: 8,
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    } else {
      navigate('/login'); 
    }
  }, [navigate]);

  const handleAddPengajuan = () => {
    // Mengarahkan ke form pengajuan baru, dapat diakses oleh user
    navigate("/admin/tambah-permohonan"); 
  };
  
  if (loading) {
    return <div className="dashboard">Memuat data pengguna...</div>;
  }
  
  return (
    <div className="dashboard"> 
      <main className="dashboard-content">
        
        {/* HEADER DASHBOARD (Hanya 1x) */}
        <h1>Dashboard Pengguna | {user.nama || 'Pengguna DTSEN'}</h1>
        <p>
          Selamat datang kembali. Anda login sebagai **{user.role?.toUpperCase()}** dari **{user.instansi || 'Instansi Tidak Diketahui'}**.
        </p>

        {/* SUMMARY CARDS (Hanya 1x) */}
        <div className="summary-cards">
          <SummaryCard title="Status Akun" value={user.status?.toUpperCase() || 'ACTIVE'} color="#007bff" />
          <SummaryCard title="Pengajuan Selesai" value={`${summaryData.pengajuanSelesai} Data`} color="#28a745" />
          <SummaryCard title="Sedang Diproses" value={`${summaryData.pengajuanDiproses} Data`} color="#ffc107" />
          <SummaryCard title="Total Pengajuan" value={`${summaryData.totalPengajuan} Data`} color="#dc3545" />
        </div>
        
        {/* TAB Fungsionalitas User */}
        <div className="chart-card" style={{ marginTop: '2rem', padding: '1rem' }}>
            
            {/* Navigasi Tab */}
            <div className="tab-container" style={{ marginBottom: '20px', borderBottom: '2px solid #eee' }}>
                <button
                    className={`tab ${activeTab === "permohonan" ? "active" : ""}`}
                    onClick={() => setActiveTab("permohonan")}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: '10px 20px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        borderBottom: activeTab === "permohonan" ? '3px solid #005ea5' : 'none',
                        color: activeTab === "permohonan" ? '#005ea5' : '#555',
                    }}
                >
                    Riwayat Permohonan Akses Data
                </button>
                <button
                    className={`tab ${activeTab === "tahapan" ? "active" : ""}`}
                    onClick={() => setActiveTab("tahapan")}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: '10px 20px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        borderBottom: activeTab === "tahapan" ? '3px solid #005ea5' : 'none',
                        color: activeTab === "tahapan" ? '#005ea5' : '#555',
                    }}
                >
                    Cek Tahapan Dokumen
                </button>
            </div>


            {/* Konten Tab Aktif: Permohonan Akses Data */}
            {activeTab === 'permohonan' && (
                <>
                    {/* Tombol Tambah hanya tampil di tab Permohonan */}
                    <button 
                      className="add-btn" 
                      onClick={handleAddPengajuan} 
                      style={{ 
                          marginBottom: '20px', 
                          padding: '10px 20px', 
                          backgroundColor: '#28a745', 
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                      }}
                    >
                      + Tambah Permohonan Akses Data Baru
                    </button>
                    {/* Menggunakan isUserContext=true agar PermohonanAksesData.jsx tahu ini di konteks user */}
                    <PermohonanAksesData isUserContext={true} />
                </>
            )}

            {/* Konten Tab Aktif: Cek Tahapan Dokumen */}
            {activeTab === 'tahapan' && (
                // Menggunakan isUserContext=true agar CekTahapanDokumen.jsx tahu ini di konteks user
                <CekTahapanDokumen isUserContext={true} />
            )}

        </div>
      </main>
    </div>
  );
}