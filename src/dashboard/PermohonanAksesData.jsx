import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient"; // Import API Client

export default function PermohonanAksesData() {
  // State untuk menyimpan data, status loading, dan error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State filter pencarian
  const [filters, setFilters] = useState({
    nomor: "",
    instansi: "",
    permintaan: "",
    pemohon: "",
    jabatan: "",
    tanggal: "",
  });

  // Ambil data dari backend saat pertama kali halaman dimuat
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/request/requests");

        // Format data agar sesuai tabel frontend
        const formattedData = response.data.data.map((item) => {
          // Format tanggal dengan aman
          let tanggalPermohonan = "N/A";
          const dateValue = item.created_at || item.tanggal_pengajuan;
          if (dateValue) {
            const dateObject = new Date(dateValue);
            if (!isNaN(dateObject.getTime())) {
              tanggalPermohonan = dateObject
                .toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .replace(/\./g, "");
            }
          }

          return {
            id: item.id,
            nomor: item.nomor_permohonan,
            instansi: item.user?.instansi || item.nama_instansi,
            permintaan:
              item.requested_datasets
                ?.map((d) => d.tema_data)
                .join(", ") || item.tema_data || "-",
            pemohon: item.user?.nama || "N/A",
            jabatan: item.user?.jabatan || "N/A",
            tanggal: tanggalPermohonan,
          };
        });

        setData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching request data:", err.response || err);
        setError(
          "Gagal memuat data permohonan. (Akses ditolak atau server error)"
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle perubahan pada input filter
  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  // Filter data sesuai input pengguna
  const filteredData = data.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key]?.toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // Tampilan saat loading
  if (loading) {
    return (
      <div
        className="permohonan-container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <h2>Memuat Data Permohonan...</h2>
      </div>
    );
  }

  // Tampilan saat error
  if (error) {
    return (
      <div
        className="permohonan-container"
        style={{ textAlign: "center", padding: "50px", color: "red" }}
      >
        <h2>Error: {error}</h2>
        <p>Pastikan Anda login sebagai Admin dan *backend* berjalan.</p>
      </div>
    );
  }

  // Tampilan utama (read-only)
  return (
    <div className="permohonan-container">
      <div className="header-row">
        <h2>Permohonan Akses Data</h2>
      </div>

      <div className="table-section">
        <h3>TABEL INFORMASI PERMOHONAN AKSES DATA</h3>
        <p>
          Berisi informasi riwayat permohonan akses data (
          {filteredData.length} data ditemukan)
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
            </tr>
            <tr>
              {Object.keys(filters).map((key) => (
                <th key={key}>
                  <input
                    type="text"
                    placeholder={`-- filter ${key} --`}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                  />
                </th>
              ))}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Tidak ada data permohonan yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
