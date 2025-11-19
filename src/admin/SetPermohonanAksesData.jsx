import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import apiClient from "../api/apiClient";

// Helper: Format timestamp ke format Indonesia
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const dateObject = new Date(timestamp);
  if (isNaN(dateObject.getTime())) return "N/A";

  return dateObject
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "");
};

// --- Modal Detail ---
const PermohonanDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  const datasetGroups = data.requested_datasets || [];
  const documents = data.documents || [];

  const pemohonNama = data.user?.nama || "N/A";
  const pemohonInstansi = data.user?.instansi || data.nama_instansi || "N/A";
  const pemohonJabatan = data.user?.jabatan || "N/A";

  const handleViewDocument = async (docId, fileName, fileType) => {
    try {
      const response = await apiClient.get(`/request/documents/${docId}/file`);
      const { file_data, file_type: apiFileType } = response.data.data;

      if (!file_data) {
        alert("Data file tidak tersedia atau kosong.");
        return;
      }

      const mimeType = apiFileType || fileType || "application/octet-stream";
      const base64String = file_data.includes("base64,")
        ? file_data.split("base64,")[1]
        : file_data;

      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error viewing document:", err.response || err);
      alert(
        `Gagal melihat dokumen: ${
          err.response?.data?.message || "Server error."
        }`
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          Detail Permohonan: {data.nomor_permohonan}
        </h3>

        <section>
          <h4 className="section-title">Informasi Utama</h4>
          <p><strong>Nomor Permohonan:</strong> {data.nomor_permohonan}</p>
          <p><strong>Status Terakhir:</strong> {data.status?.toUpperCase()}</p>
          <p><strong>Tanggal Pengajuan:</strong> {formatTimestamp(data.tanggal_pengajuan || data.created_at)}</p>
          <p><strong>Tema Data Ringkas:</strong> {data.tema_data}</p>
          <p><strong>Total Hari Kerja:</strong> {data.total_hari_kerja || 0} hari</p>
        </section>

        <section>
          <h4 className="section-title">Data Pemohon</h4>
          <p><strong>Nama Pemohon:</strong> {pemohonNama}</p>
          <p><strong>Instansi:</strong> {pemohonInstansi}</p>
          <p><strong>Unit Kerja:</strong> {data.unit_kerja || "-"}</p>
          <p><strong>Jabatan:</strong> {pemohonJabatan}</p>
          <p><strong>Email:</strong> {data.user?.email || "-"}</p>
          <p><strong>No. HP:</strong> {data.user?.no_hp || "-"}</p>
        </section>

        <section>
          <h4 className="section-title">
            Dataset yang Diminta ({datasetGroups.length})
          </h4>
          {datasetGroups.length > 0 ? (
            datasetGroups.map((dataset, i) => (
              <div className="dataset-card" key={i}>
                <p><strong>Tema:</strong> {dataset.tema_data}</p>
                <p><strong>Format File:</strong> {dataset.format_file}</p>
                <p><strong>Variabel Dipilih ({dataset.selected_variables?.length || 0}):</strong></p>
                <ul>
                  {dataset.selected_variables?.map((v, j) => (
                    <li key={j}>{v.variable_name}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Tidak ada dataset yang diminta.</p>
          )}
        </section>

        <section>
          <h4 className="section-title">
            Dokumen Terunggah ({documents.length})
          </h4>
          <ul>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <li key={doc.id} className="document-item">
                  <span>
                    <strong>{doc.jenis_dokumen.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                    {doc.nama_dokumen}{" "}
                    {doc.keterangan && `(Ket: ${doc.keterangan})`}
                  </span>
                  <button
                    onClick={() =>
                      handleViewDocument(doc.id, doc.nama_dokumen, doc.file_type)
                    }
                    className="btn-view"
                  >
                    Lihat File
                  </button>
                </li>
              ))
            ) : (
              <li>Tidak ada dokumen terunggah.</li>
            )}
          </ul>
        </section>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama ---
export default function PermohonanAksesData() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRequestDetail, setSelectedRequestDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [filters, setFilters] = useState({
    nomor: "",
    instansi: "",
    permintaan: "",
    pemohon: "",
    jabatan: "",
    tanggal: "",
  });

  // Fetch Data
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiClient.get("/request/requests");
        const allRequests = response.data.data;

        const formattedData = allRequests.map((item) => ({
          id: item.id,
          nomor: item.nomor_permohonan,
          instansi: item.user?.instansi || item.nama_instansi,
          permintaan:
            item.requested_datasets?.map((d) => d.tema_data).join(", ") ||
            item.tema_data ||
            "-",
          pemohon: item.user?.nama || "N/A",
          jabatan: item.user?.jabatan || "N/A",
          tanggal: formatTimestamp(item.created_at || item.tanggal_pengajuan),
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Error fetching request data:", err);
        setError("Gagal memuat data permohonan.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // === DELETE HANDLER ===
  const handleDelete = async (requestId) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus permohonan ini? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/request/requests/${requestId}`);

      setData((prev) => prev.filter((item) => item.id !== requestId));

      alert("Permohonan berhasil dihapus.");
    } catch (err) {
      console.error("Error deleting request:", err);
      alert(
        err.response?.data?.message ||
          "Gagal menghapus permohonan. Silakan coba lagi."
      );
    }
  };

  const handleDetailClick = async (requestId) => {
    try {
      const response = await apiClient.get(`/request/requests/${requestId}`);
      setSelectedRequestDetail(response.data.data);
      setShowDetailModal(true);
    } catch {
      alert("Gagal memuat detail permohonan.");
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const filteredData = data.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key]?.toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  if (loading) return <div className="loading">Memuat data permohonan...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="permohonan-container">
      <div className="header-row">
        <h2>Permohonan Akses Data</h2>
        <button
          className="new-request-btn"
          onClick={() => navigate("/admin/tambah-permohonan")}
        >
          + Permohonan Akses Data Baru
        </button>
      </div>

      <div className="table-section">
        <h3>Tabel Informasi Permohonan Akses Data</h3>
        <p>
          Berisi informasi riwayat permohonan akses data ({filteredData.length}{" "}
          data ditemukan)
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>NOMOR PERMOHONAN</th>
              <th>NAMA INSTANSI</th>
              <th>PERMINTAAN DATA</th>
              <th>NAMA PEMOHON</th>
              <th>JABATAN</th>
              <th>TANGGAL PERMOHONAN</th>
              <th>AKSI</th>
            </tr>
            <tr>
              {Object.keys(filters).map((key) => (
                <th key={key}>
                  <input
                    type="text"
                    placeholder={`Filter ${key}`}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                  />
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id}>
                  <td>{row.nomor}</td>
                  <td>{row.instansi}</td>
                  <td>{row.permintaan}</td>
                  <td>{row.pemohon}</td>
                  <td>{row.jabatan}</td>
                  <td>{row.tanggal}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-detail"
                        onClick={() => handleDetailClick(row.id)}
                      >
                        ℹ Detail
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(row.id)}
                      >
                        🗑 Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Tidak ada data permohonan yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetailModal && (
        <PermohonanDetailModal
          data={selectedRequestDetail}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}
