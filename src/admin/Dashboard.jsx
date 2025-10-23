import React from "react";
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

export default function Dashboard() {
  // Data dummy pengajuan per tahun oleh OPD
  const data = [
    { tahun: "2025", pengajuan: 120 },
    { tahun: "2026", pengajuan: 180 },
    { tahun: "2027", pengajuan: 210 },
    { tahun: "2028", pengajuan: 250 },
    { tahun: "2029", pengajuan: 310 },
    { tahun: "2030", pengajuan: 370 },
  ];

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        <h1>Dashboard Admin</h1>
        <p>
          Statistik pengajuan data oleh OPD berdasarkan tahun. Data ini
          memberikan gambaran pertumbuhan jumlah pengajuan setiap tahunnya.
        </p>

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
      </main>
    </div>
  );
}
