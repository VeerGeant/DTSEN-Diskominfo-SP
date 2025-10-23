import React from "react";
import { useNavigate } from 'react-router-dom';

export default function TahapanDokumen() {
  const navigate = useNavigate();
  const data = [
    {
      nama: "Permohonan Akses Data",
      deskripsi: "permohonan data",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "success",
    },
    {
      nama: "Verifikasi Teknis",
      deskripsi: "dokumen sudah lengkap",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "success",
    },
    {
      nama: "Verifikasi Substansi",
      deskripsi: "dokumen sudah sesuai substansi",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "success",
    },
    {
      nama: "Verifikasi Koordinator",
      deskripsi: "silahkan diproses lebih lanjut",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "success",
    },
    {
      nama: "Pengolahan Data",
      deskripsi: "tautan telah tersedia",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "success",
    },
    {
      nama: "Cek Kualitas Data",
      deskripsi: "data sudah ok",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "failed",
    },
    {
      nama: "Unduh Data",
      deskripsi: "unggah BAST",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "pending",
    },
    {
      nama: "Verifikasi BAST",
      deskripsi: "dokumen telah sesuai ketentuan",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "pending",
    },
    {
      nama: "Selesai",
      deskripsi: "selesai",
      tanggal: "24-08-2025",
      hariKerja: 0,
      status: "pending",
    },
  ];

  return (
    <div className="tahapan-container">
      <h3 className="judul-section">Tahapan Proses Dokumen</h3>

      <div className="info-section">
        <p><b>Nomor Permohonan Dokumen:</b> SM.01/II/2025/001</p>
        <p><b>Tema Permintaan Data:</b> Set Data Keluarga</p>
        <p><b>Nama Pemohon:</b> Pengguna (K/L/D)</p>
        <p><b>Instansi:</b> Kabupaten Purbalingga</p>
        <p><b>Total Hari Kerja:</b> 0</p>
      </div>

      <div className="timeline-wrapper">
        {data.map((item, index) => {
          const nextStatus = data[index + 1]?.status || null;
          return (
            <div key={index} className="timeline-item">
              {/* Dot dan garis */}
              <div className="timeline-status">
                <div className={`dot ${item.status}`}></div>
                {index !== data.length - 1 && (
                  <div className={`line ${nextStatus}`}></div>
                )}
              </div>

              <div className="timeline-nama">{item.nama}</div>
              <div className="timeline-deskripsi">{item.deskripsi}</div>
              <div className="timeline-tanggal">{item.tanggal}</div>
              <div className="timeline-hari">{item.hariKerja} hari kerja</div>
            </div>
          );
        })}
      </div>

      <div className="button-section">
        <button className="btn-kembali"
        onClick={() => navigate('/admin/cek-tahapan')}
        >← Kembali</button>
      </div>
    </div>
  );
}
