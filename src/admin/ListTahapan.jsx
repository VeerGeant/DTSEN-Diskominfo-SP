import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import apiClient from "../api/apiClient";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const dateObject = new Date(timestamp);
  if (isNaN(dateObject.getTime())) return 'N/A';
  return dateObject.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/\./g, '');
};

const getStatusClass = (status) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('selesai')) return 'selesai';
  if (lowerStatus.includes('menyiapkan') || lowerStatus.includes('dikirim')) return 'menunggu';
  return 'proses';
};

export default function ListTahapan() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterNomor, setFilterNomor] = useState("");
  const [filterPermintaan, setFilterPermintaan] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/request/requests");
      const formattedData = response.data.data.map(item => {
        const created_timestamp = item.created_at || item.tanggal_pengajuan;
        const updated_timestamp = item.updated_at || item.created_at || item.tanggal_pengajuan;
        return {
          id: item.id,
          nomor: item.nomor_permohonan,
          status: item.status.replace(/_/g, " ").toUpperCase(),
          permintaan: item.requested_datasets?.map(d => d.tema_data).join(', ') || item.tema_data || "N/A",
          tanggalDibuat: formatTimestamp(created_timestamp),
          terakhirUpdate: formatTimestamp(updated_timestamp),
        };
      });
      setData(formattedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Gagal memuat daftar permohonan. Pastikan backend berjalan dan Anda login sebagai Admin.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = data.filter(
    (item) =>
      item.nomor.toLowerCase().includes(filterNomor.toLowerCase()) &&
      item.permintaan.toLowerCase().includes(filterPermintaan.toLowerCase())
  );

  const handleAksiClick = useCallback((requestId) => {
    navigate(`/admin/verifikasi-tahapan?requestId=${requestId}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="list-tahapan-container">
        <h2>Memuat Daftar Permohonan...</h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="list-tahapan-container error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="list-tahapan-container">
      <h2 className="list-tahapan-title">Daftar Permohonan untuk Aksi Verifikasi Tahapan</h2>

      <div className="list-tahapan-table-section">
        <div className="list-tahapan-table-header">
          <div>
            <h3>Tabel Informasi Permohonan ({filteredData.length} data)</h3>
            <p>Klik <strong>⚙ Aksi</strong> untuk mengubah status tahapan.</p>
          </div>

          <div className="list-tahapan-filter-bar">
            <input type="date" />
            <span>s/d</span>
            <input type="date" />
            <button className="list-tahapan-btn-cari">Cari</button>
          </div>
        </div>

        <table className="list-tahapan-table">
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
              <th>TAHAP TERKINI</th>
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
                  <td>
                    <span className={`list-tahapan-status ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.tanggalDibuat}</td>
                  <td>{item.terakhirUpdate}</td>
                  <td>
                    <button
                      className="list-tahapan-btn-aksi"
                      onClick={() => handleAksiClick(item.id)}
                    >
                      ⚙ Aksi
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="list-tahapan-empty">Tidak ada data cocok dengan filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
