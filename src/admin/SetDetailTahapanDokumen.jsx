import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from "../api/apiClient";

export default function TahapanDokumen() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = new URLSearchParams(location.search).get('requestId');

  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!requestId) {
        setError("ID Permohonan tidak ditemukan di URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(`/request/requests/${requestId}`);
        setRequestData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching request detail:", err.response || err);
        setError("Gagal memuat detail permohonan. (Pastikan ID valid)");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [requestId]);

  if (loading)
    return <div className="tahapan-container" style={{ textAlign: 'center', padding: '50px' }}>Memuat Detail Tahapan...</div>;
  if (error)
    return <div className="tahapan-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  if (!requestData)
    return <div className="tahapan-container" style={{ textAlign: 'center', padding: '50px' }}>Data Permohonan tidak ditemukan.</div>;

  const stages = requestData.stages.sort((a, b) => a.id - b.id);
  const totalHariKerja = requestData.total_hari_kerja || 0;
  const pemohon = requestData.user || {};

  // mapping warna berdasarkan status
  const getStageStatusClass = (status) => {
    if (status === "selesai") return "success";
    if (status === "proses") return "process";
    return "pending";
  };

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
          const statusClass = getStageStatusClass(item.status);
          const nextStage = stages[index + 1];
          const nextStatusClass = nextStage ? getStageStatusClass(nextStage.status) : null;

          return (
            <div key={item.id} className="timeline-item">
              <div className="timeline-status">
                <div className={`dot ${statusClass}`}></div>
                {nextStage && (
                  <div className={`line ${nextStatusClass}`}></div>
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
        <button className="btn-kembali" onClick={() => navigate('/admin/set-tahapan')}>
          ← Kembali
        </button>
      </div>
    </div>
  );
}
