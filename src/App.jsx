import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pengajuan from "./pages/Pengajuan";
import Daftar from "./pages/Daftar";
import Login from "./pages/Login";



import NavbarAdmin from "./admin/NavbarAdmin";
import Dashboard from "./admin/Dashboard";
import ManajemenUser from "./admin/ManajemenUser";
import LogActivity from "./admin/LogActivity";

import PermohonanAksesData from "./admin/PermohonanAksesData";
import TambahPermohonanAkses from "./admin/TambahPermohonanAkses";
import CekTahapanDokumen from "./admin/CekTahapanDokumen";
import DetailTahapanDokumen from "./admin/DetailTahapanDokumen";


// Layout untuk user
function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Layout untuk admin
function AdminLayout() {
  return (
    <>
      <NavbarAdmin />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* User Pages */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pengajuan" element={<Pengajuan />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin Pages */}
        <Route path="/admin" element={<NavbarAdmin />}>
          {/* Redirect otomatis dari /admin ke /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Halaman-halaman admin */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manajemen-user" element={<ManajemenUser />} />
          <Route path="log-activity" element={<LogActivity />} />
          <Route path="permohonan-akses" element={<PermohonanAksesData />} />
          <Route path="tambah-permohonan" element={<TambahPermohonanAkses />} />
          <Route path="cek-tahapan" element={<CekTahapanDokumen />} />
          <Route path="detail-tahapan" element={<DetailTahapanDokumen />} />
          

        </Route>
      </Routes>
    </Router>
  );
}
