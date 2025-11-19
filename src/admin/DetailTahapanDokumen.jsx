import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from "../api/apiClient";

export default function TahapanDokumen() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = new URLSearchParams(location.search).get('requestId'); // Ambil ID dari URL

  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil detail request berdasarkan ID
  useEffect(() => {
    const fetchDetail = async () => {
      if (!requestId) {
        setError("ID Permohonan tidak ditemukan di URL.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Panggil endpoint GET /request/requests/:id
        const response = await apiClient.get(`/request/requests/${requestId}`); 
        setRequestData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching request detail:", err.response || err);
        setError("Gagal memuat detail permohonan. (Pastikan ID valid)");
        setRequestData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [requestId]);

  // Handle Loading/Error State
  if (loading) return <div className="tahapan-container" style={{ textAlign: 'center', padding: '50px' }}>Memuat Detail Tahapan...</div>;
  if (error) return <div className="tahapan-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  if (!requestData) return <div className="tahapan-container" style={{ textAlign: 'center', padding: '50px' }}>Data Permohonan tidak ditemukan.</div>;

  // Data yang akan ditampilkan
  const stages = requestData.stages.sort((a, b) => a.id - b.id);
  const totalHariKerja = requestData.total_hari_kerja || 0;
  const pemohon = requestData.user || {};

  // Fungsi untuk mendapatkan status dot/line class
  const getStageStatusClass = (status) => {
    if (status === "selesai") return "success";
    if (status === "proses") return "active"; // Tambahkan CSS untuk 'active' jika perlu, atau gunakan 'success'
    if (status === "menunggu") return "pending";
    return "pending";
  };
  
  // Fungsi untuk memformat tanggal
  const formatTanggal = (dateString) => {
  if (!dateString) return "-";
  
  // Pastikan waktu diubah ke zona waktu lokal
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  // Format lengkap: 12 November 2025, 14:35 WIB
  const formatted = date.toLocaleString("id-ID", {
    weekday: "long", // opsional: "Senin", "Selasa", dll.
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatted.replace(",", ""); // biar lebih rapi
};

  return (
    <div className="tahapan-container">
      <h3 className="judul-section">Tahapan Proses Dokumen</h3>

      <div className="info-section">
        <p><b>Nomor Permohonan Dokumen:</b> {requestData.nomor_permohonan}</p>
        <p><b>Tema Permintaan Data:</b> {requestData.tema_data}</p>
        <p><b>Nama Pemohon:</b> {pemohon.nama || requestData.nama_instansi}</p>
        <p><b>Instansi:</b> {pemohon.instansi || "-"}</p>
        <p><b>Total Hari Kerja:</b> {totalHariKerja} hari</p>
      </div>

      <div className="timeline-wrapper">
  {stages.map((item, index) => {
    // Ambil status dan tahap selanjutnya
    const nextStatus = stages[index + 1]?.status || "pending";

    // Cari index terakhir yang selesai
    const lastDoneIndex = stages.reduce(
      (lastIndex, stage, i) => (stage.status === "selesai" ? i : lastIndex),
      -1
    );

    // Kalau ini adalah tahap terakhir 'selesai', jangan buat garis setelahnya
    const isLastDone = index === lastDoneIndex;

    return (
      <div key={item.id} className="timeline-item">
        <div className="timeline-status">
          {/* Dot */}
          <div className={`dot ${getStageStatusClass(item.status)}`}></div>

          {/* Line kanan hanya kalau bukan tahap terakhir 'selesai' */}
          {!isLastDone && index < stages.length - 1 && (
            <div className={`line ${getStageStatusClass(nextStatus)}`}></div>
          )}
        </div>

        <div className="timeline-nama">
          {item.tahap.replace(/_/g, " ").toUpperCase()}
        </div>
        <div className="timeline-deskripsi">
          {item.keterangan || item.status}
        </div>
        <div className="timeline-tanggal">
          {formatTanggal(item.tanggal_selesai || item.tanggal_mulai)}
        </div>
        <div className="timeline-hari">
          {item.hari_kerja || 0} hari kerja
        </div>
      </div>
    );
  })}
</div>


      <div className="button-section">
        <button 
            className="btn-kembali"
            onClick={() => navigate('/admin/cek-tahapan')}
        >
            ← Kembali
        </button>
      </div>
    </div>
  );
}