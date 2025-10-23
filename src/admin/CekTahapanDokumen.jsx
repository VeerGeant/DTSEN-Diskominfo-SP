import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';



export default function CekTahapanDokumen() {
  const [filterNomor, setFilterNomor] = useState("");
  const [filterPermintaan, setFilterPermintaan] = useState("");
    const navigate = useNavigate();
  
  const data = [
    {
      nomor: "TEST-01/XIII-2025",
      permintaan: "Set Data Keluarga",
      tanggalDibuat: "16-07-2025",
      terakhirUpdate: "29-07-2025",
    },
    {
      nomor: "PRC-XIII/PR0999/OKK",
      permintaan: "Set Data Keluarga",
      tanggalDibuat: "16-07-2025",
      terakhirUpdate: "05-08-2025",
    },
    {
      nomor: "01/SK/2025/07/01",
      permintaan: "Set Data Keluarga",
      tanggalDibuat: "23-07-2025",
      terakhirUpdate: "23-07-2025",
    },
    {
      nomor: "SRT-III/BMS/2025",
      permintaan: "Set Data Anggota Keluarga (Individu)",
      tanggalDibuat: "31-07-2025",
      terakhirUpdate: "04-08-2025",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.nomor.toLowerCase().includes(filterNomor.toLowerCase()) &&
      item.permintaan.toLowerCase().includes(filterPermintaan.toLowerCase())
  );

  return (
    <div className="cek-tahapan-container">
      <h2>Cek Tahapan Dokumen</h2>

      <div className="table-section">
        <div className="table-header">
          <div>
            <h3>Tabel Informasi Cek Tahapan Dokumen</h3>
            <p>Berisi informasi riwayat tahapan dokumen</p>
          </div>

          <div className="filter-bar">
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
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.nomor}</td>
                <td>{item.permintaan}</td>
                <td>{item.tanggalDibuat}</td>
                <td>{item.terakhirUpdate}</td>
                <td>
                  <button className="btn-detail" 
                  onClick={() => navigate('/admin/detail-tahapan')}
                  >ℹ Detail Info</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
