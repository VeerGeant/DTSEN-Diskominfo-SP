import { useState } from "react";


export default function Pengajuan() {
  const [pengajuan] = useState([
    { id: 1, nama: "Permohonan Data Sosial 2025", tanggal: "08 Okt 2025", status: "validasi" },
    { id: 2, nama: "Data Bantuan Ekonomi", tanggal: "02 Okt 2025", status: "proses" },
  ]);

  return (
    <div className="pengajuan-container">
      
        
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
          <button className="add-btn">+ Tambah Pengajuan</button>
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
                  className={`status-badge ${
                    item.status === "validasi" ? "validasi" : "proses"
                  }`}
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
