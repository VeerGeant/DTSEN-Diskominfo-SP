import React, { useState } from "react";

export default function LogActivity() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      waktu: "2025-10-14 09:30",
      user: "user_opd",
      role: "OPD",
      aktivitas: "Mengajukan permohonan layanan baru",
      status: "Sukses",
    },
    {
      id: 2,
      waktu: "2025-10-14 09:45",
      user: "sekda_1",
      role: "SEKDA",
      aktivitas: "Menyetujui pengajuan #A001",
      status: "Sukses",
    },
    {
      id: 3,
      waktu: "2025-10-14 10:00",
      user: "diskominfo_1",
      role: "DISKOMINFO",
      aktivitas: "Mengedit data master aplikasi",
      status: "Sukses",
    },
    {
      id: 4,
      waktu: "2025-10-14 10:10",
      user: "bappeda_1",
      role: "BAPPEDA",
      aktivitas: "Melihat laporan pengajuan",
      status: "Sukses",
    },
    {
      id: 5,
      waktu: "2025-10-14 10:15",
      user: "admin_utama",
      role: "ADMIN",
      aktivitas: "Menghapus user test_opd",
      status: "Sukses",
    },
  ]);

  const [filter, setFilter] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.role.toLowerCase().includes(filter.toLowerCase()) ||
      log.aktivitas.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="log-activity-page">
      <h1>Log Aktivitas</h1>
      <p>Lihat semua aktivitas pengguna di dalam sistem DTSEN.</p>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Cari berdasarkan user, role, atau aktivitas..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="log-table-container">
        <table className="log-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Waktu</th>
              <th>User</th>
              <th>Role</th>
              <th>Aktivitas</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{log.waktu}</td>
                  <td>{log.user}</td>
                  <td>{log.role}</td>
                  <td>{log.aktivitas}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        log.status === "Sukses" ? "success" : "failed"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
