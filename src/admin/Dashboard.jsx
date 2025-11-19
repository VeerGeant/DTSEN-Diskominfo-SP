import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiClient from "../api/apiClient";

export default function Dashboard() {
  const data = [
    { tahun: "2025", pengajuan: 120 },
    { tahun: "2026", pengajuan: 180 },
    { tahun: "2027", pengajuan: 210 },
    { tahun: "2028", pengajuan: 250 },
    { tahun: "2029", pengajuan: 310 },
    { tahun: "2030", pengajuan: 370 },
  ];

  const [latestRequest, setLatestRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestRequest = async () => {
      try {
        const response = await apiClient.get("/request/requests");
        const requests = response.data.data;

        if (requests.length > 0) {
          const sorted = requests.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestRequest(sorted[0]);
        }
      } catch (error) {
        console.error("Gagal memuat permohonan terbaru:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestRequest();
  }, []);

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID");
  };

  const getStageStatusClass = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("selesai")) return "success";
    if (lower.includes("proses")) return "process";
    return "pending";
  };

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <h1>Dashboard Admin</h1>
        <p>
          Statistik pengajuan data oleh OPD berdasarkan tahun. Data ini memberikan gambaran pertumbuhan jumlah pengajuan setiap tahunnya.
        </p>

        {/* === Chart Section === */}
        <div className="chart-card">
          <h2>Jumlah Pengajuan Data OPD per Tahun</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tahun" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pengajuan" fill="#205295" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* === Summary Section === */}
        <div className="summary-cards">
          <div className="card">
            <h3>Total Pengajuan (2025–2030)</h3>
            <p>{data.reduce((a, b) => a + b.pengajuan, 0)}</p>
          </div>
          <div className="card">
            <h3>Tahun dengan Pengajuan Tertinggi</h3>
            <p>{data.reduce((a, b) => (a.pengajuan > b.pengajuan ? a : b)).tahun}</p>
          </div>
          <div className="card">
            <h3>Rata-Rata Pengajuan per Tahun</h3>
            <p>{Math.round(data.reduce((a, b) => a + b.pengajuan, 0) / data.length)}</p>
          </div>
        </div>

        {/* === INFORMASI DATASET PERMOHONAN TERBARU === */}
        <div className="dataset-summary-card">
          <h3>Informasi Dataset Permohonan Terbaru</h3>

          {loading ? (
            <p>Memuat data...</p>
          ) : latestRequest ? (
            latestRequest.requested_datasets?.length > 0 ? (
              <table className="dataset-info-table">
                <thead>
                  <tr>
                    <th>Nama Dataset</th>
                    <th>Desil</th>
                    <th>Total Data Diterima</th>
                    <th>Versi Dataset</th>
                  </tr>
                </thead>
                <tbody>
                  {latestRequest.requested_datasets.map((ds) => (
                    <tr key={ds.id}>
                      <td>{ds.nama_dataset || "-"}</td>
                      <td>{ds.desil || "-"}</td>
                      <td>{ds.total_data_diterima || 0}</td>
                      <td>{ds.dataset_version || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Tidak ada dataset pada permohonan ini.</p>
            )
          ) : (
            <p>Tidak ditemukan permohonan terbaru.</p>
          )}
        </div>

        {/* === Timeline Tahapan === */}
        <div className="tahapan-container" style={{ marginTop: "40px" }}>
          <h3 className="judul-section">Tahapan Permohonan Terbaru</h3>

          {loading ? (
            <p>Sedang memuat data tahapan...</p>
          ) : latestRequest ? (
            <>
              <div className="info-section">
                <p><b>Nomor Permohonan Dokumen:</b> {latestRequest.nomor_permohonan}</p>
                <p><b>Tema Permintaan Data:</b> {latestRequest.tema_data || latestRequest.requested_datasets?.[0]?.tema_data || "-"}</p>
                <p><b>Status Terbaru:</b> {latestRequest.status.replace(/_/g, " ").toUpperCase()}</p>
              </div>

              <div className="timeline-wrapper">
                {latestRequest.stages &&
                  latestRequest.stages
                    .sort((a, b) => a.id - b.id)
                    .map((stage, index, arr) => {
                      const nextStatus = arr[index + 1]?.status || "pending";
                      const lastDoneIndex = arr.reduce(
                        (last, s, i) => (s.status === "selesai" ? i : last),
                        -1
                      );
                      const isLastDone = index === lastDoneIndex;

                      return (
                        <div key={stage.id} className="timeline-item">
                          <div className="timeline-status">
                            <div className={`dot ${getStageStatusClass(stage.status)}`}></div>
                            {!isLastDone && index < arr.length - 1 && (
                              <div className={`line ${getStageStatusClass(nextStatus)}`}></div>
                            )}
                          </div>

                          <div className="timeline-nama">
                            {stage.tahap.replace(/_/g, " ").toUpperCase()}
                          </div>
                          <div className="timeline-deskripsi">
                            {stage.keterangan || stage.status}
                          </div>
                          <div className="timeline-tanggal">
                            {formatTanggal(stage.tanggal_selesai || stage.tanggal_mulai)}
                          </div>
                          <div className="timeline-hari">
                            {stage.hari_kerja || 0} hari kerja
                          </div>
                        </div>
                      );
                    })}
              </div>
            </>
          ) : (
            <p>Tidak ada permohonan terbaru yang ditemukan.</p>
          )}
        </div>
      </main>
    </div>
  );
}
