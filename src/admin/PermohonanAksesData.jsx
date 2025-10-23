import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PermohonanAksesData() {
  const navigate = useNavigate(); 

  const [data] = useState([
    {
      nomor: "TEST-01/XIII-2025",
      instansi: "Kabupaten Pangandaran",
      permintaan: "Set Data Keluarga",
      pemohon: "Pengguna (Walidata)",
      jabatan: "Kepala SDI",
      tanggal: "16-07-2025",
    },
    {
      nomor: "PRC-XIIII/PRO999/OKK",
      instansi: "Kabupaten Pangandaran",
      permintaan: "Set Data Keluarga",
      pemohon: "Pengguna (Walidata)",
      jabatan: "Kepala SDI",
      tanggal: "16-07-2025",
    },
    {
      nomor: "01/SK/2025/07/01",
      instansi: "Kabupaten Pangandaran",
      permintaan: "Set Data Keluarga",
      pemohon: "ALEXANDER NOEL",
      jabatan: "Deputi",
      tanggal: "23-07-2025",
    },
    {
      nomor: "SRT-III/BMS/2025",
      instansi: "Kabupaten Pangandaran",
      permintaan: "Set Data Anggota Keluarga (Individu)",
      pemohon: "Pengguna (Walidata)",
      jabatan: "Kepala SDI",
      tanggal: "31-07-2025",
    },
    {
      nomor: "SRT-33242",
      instansi: "Kabupaten Pangandaran",
      permintaan: "Set Data Keluarga",
      pemohon: "Pengguna (Walidata)",
      jabatan: "Kepala SDI",
      tanggal: "01-08-2025",
    },
  ]);

  const [filters, setFilters] = useState({
    nomor: "",
    instansi: "",
    permintaan: "",
    pemohon: "",
    jabatan: "",
    tanggal: "",
  });

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const filteredData = data.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key].toLowerCase().includes(filters[key].toLowerCase())
    )
  );

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
        <h3>TABEL INFORMASI PERMOHONAN AKSES DATA</h3>
        <p>Berisi informasi riwayat permohonan akses data</p>

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
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.nomor}</td>
                <td>{row.instansi}</td>
                <td>{row.permintaan}</td>
                <td>{row.pemohon}</td>
                <td>{row.jabatan}</td>
                <td>{row.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
