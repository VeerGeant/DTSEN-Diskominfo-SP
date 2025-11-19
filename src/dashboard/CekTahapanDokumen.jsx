import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import apiClient from "../api/apiClient"; 

// Fungsi helper untuk memformat timestamp (di luar komponen)
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Coba buat objek Date
    const dateObject = new Date(timestamp);
    
    // Periksa validitas Date object
    if (isNaN(dateObject.getTime())) {
        return 'N/A';
    }

    // Format tanggal
    return dateObject.toLocaleDateString('id-ID', {
        day: '2-digit', 
        month: 'short', 
        year: 'numeric'
        
    }).replace(/\./g, ''); 
};


export default function CekTahapanDokumen() {
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterNomor, setFilterNomor] = useState("");
  const [filterPermintaan, setFilterPermintaan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/request/requests"); 
        
        const formattedData = response.data.data.map(item => {
            
            // ✅ LOGIKA FALLBACK TANG+GAL
            // Coba created_at, jika null, fallback ke tanggal_pengajuan
            const created_timestamp = item.created_at || item.tanggal_pengajuan;
            const updated_timestamp = item.updated_at || item.created_at || item.tanggal_pengajuan;
            
            const tanggalDibuat = formatTimestamp(created_timestamp);
            const terakhirUpdate = formatTimestamp(updated_timestamp);
            
            return {
                id: item.id,
                nomor: item.nomor_permohonan,
                permintaan: item.requested_datasets?.map(d => d.tema_data).join(', ') || item.tema_data || "N/A",
                tanggalDibuat: tanggalDibuat,
                terakhirUpdate: terakhirUpdate,
            };
        });

        setData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching documents:", err.response || err);
        setError("Gagal memuat data tahapan. Pastikan backend berjalan dan Anda login sebagai Admin.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const filteredData = data.filter(
    (item) =>
      item.nomor.toLowerCase().includes(filterNomor.toLowerCase()) &&
      item.permintaan.toLowerCase().includes(filterPermintaan.toLowerCase())
  );

  const handleDetailClick = (requestId) => {
    navigate(`/user/detail-tahapan-user?requestId=${requestId}`);
  };

  // --- Render Status ---
  if (loading) {
    return (
      <div className="cek-tahapan-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Memuat Data Tahapan Dokumen...</h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="cek-tahapan-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }
  
  // --- Render Tabel ---
  return (
    <div className="cek-tahapan-container">
      <h2>Cek Tahapan Dokumen</h2>

      <div className="table-section">
        <div className="table-header">
          <div>
            <h3>Tabel Informasi Cek Tahapan Dokumen</h3>
            <p>Berisi informasi riwayat tahapan dokumen ({filteredData.length} data ditemukan)</p>
          </div>

          <div className="filter-bar">
            {/* Filter tanggal hanya mockup di frontend */}
            <input type="date" />
            <span>s/d</span>
            <input type="date" />
            <button className="btn-cari">Cari</button>
          </div>
        </div>

        <table className="tahapan-table">
          <thead>
            <tr>
              <th>
                NOMOR PERMOHONAN
                <input
                  type="text"
                  placeholder="-- filter nomor permohonan --"
                  value={filterNomor}
                  onChange={(e) => setFilterNomor(e.target.value)}
                />
              </th>
              <th>
                PERMINTAAN DATA
                <input
                  type="text"
                  placeholder="-- filter permintaan data --"
                  value={filterPermintaan}
                  onChange={(e) => setFilterPermintaan(e.target.value)}
                />
              </th>
              <th>TANGGAL DIBUAT</th>
              <th>TERAKHIR UPDATE</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nomor}</td>
                      <td>{item.permintaan}</td>
                      <td>{item.tanggalDibuat}</td>
                      <td>{item.terakhirUpdate}</td>
                      <td>
                        <button 
                            className="btn-detail" 
                            onClick={() => handleDetailClick(item.id)}
                        >
                            ℹ Detail Info
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Tidak ada data yang cocok dengan filter.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
