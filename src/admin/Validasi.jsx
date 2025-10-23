import React, { useState } from "react";
import "./../styles/validasi.css";

export default function ValidasiVerifikasi() {
  const [pengajuanList, setPengajuanList] = useState([
    {
      id: 1,
      nama: "Data Infrastruktur Jalan",
      opd: "Dinas PUPR",
      tanggal: "10 Oktober 2025",
      status: "Menunggu Validasi",
      deskripsi: "Pengajuan data infrastruktur jalan kabupaten tahun 2025.",
    },
    {
      id: 2,
      nama: "Data Pendidikan",
      opd: "Dinas Pendidikan",
      tanggal: "12 Oktober 2025",
      status: "Menunggu Validasi",
      deskripsi: "Data sekolah dan siswa untuk tahun ajaran baru.",
    },
    {
      id: 3,
      nama: "Usulan Data Kesehatan",
      opd: "Dinas Kesehatan",
      tanggal: "14 Oktober 2025",
      status: "Diteruskan ke DISKOMINFO",
      deskripsi: "Format data belum dicek teknis, sudah diteruskan.",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleValidasi = (id) => {
    setPengajuanList((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "Diteruskan ke DISKOMINFO" }
          : p
      )
    );
    setSelectedItem(null);
    alert("Status diperbarui: Diteruskan ke Diskominfo ✅");
  };

  const handleTolak = (id) => {
    const alasan = prompt("Masukkan alasan penolakan (opsional):", "");
    if (alasan === null) return; // jika dibatalkan
    setPengajuanList((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "Ditolak oleh SEKDA", note: alasan }
          : p
      )
    );
    setSelectedItem(null);
    alert("Status diperbarui: Ditolak oleh Sekda ❌");
  };

  return (
    <div className="validasi-page">
      <h2>Validasi / Verifikasi Pengajuan (SEKDA)</h2>
      <p>Berikut daftar seluruh pengajuan dari OPD dan status validasinya.</p>

      <table className="validasi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Pengajuan</th>
            <th>OPD</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pengajuanList.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama}</td>
              <td>{item.opd}</td>
              <td>{item.tanggal}</td>
              <td>
                <span
                  className={`status ${
                    item.status.includes("Diteruskan")
                      ? "status-forward"
                      : item.status.includes("Ditolak")
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <button
                  className="btn-detail"
                  onClick={() => setSelectedItem(item)}
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedItem.nama}</h3>
            <p>
              <strong>OPD:</strong> {selectedItem.opd}
            </p>
            <p>
              <strong>Tanggal:</strong> {selectedItem.tanggal}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedItem.deskripsi}
            </p>
            {selectedItem.note && (
              <p>
                <strong>Catatan:</strong> {selectedItem.note}</p>
            )}

            <div className="modal-actions">
              <button
                className="btn-validasi"
                onClick={() => handleValidasi(selectedItem.id)}
              >
                Validasi & Disposisi
              </button>

              <button
                className="btn-tolak"
                onClick={() => handleTolak(selectedItem.id)}
              >
                Tolak
              </button>

              <button
                className="btn-batal"
                onClick={() => setSelectedItem(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
