// import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
// // Hapus import ToastContainer & CSS-nya untuk menghindari error instalasi
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // --- Components & Layouts ---
// import Navbar from "./components/Navbar";
// import RequireAuth from "./config/RequireAuth"; 
// import NavbarAdmin from "./admin/NavbarAdmin";

// // --- Pages (User/Public) ---
// import Home from "./pages/Home";
// import Daftar from "./pages/Daftar";
// import Login from "./pages/Login";
// import Pengajuan from "./pages/Pengajuan"; // Riwayat Pengajuan User
// import UserDashboard from "./pages/UserDashboard";

// // --- Pages (Admin) ---
// import Dashboard from "./admin/Dashboard";
// import ManajemenUser from "./admin/ManajemenUser";
// import LogActivity from "./admin/LogActivity";
// import PermohonanAksesData from "./admin/PermohonanAksesData";
// import TambahPermohonanAkses from "./admin/TambahPermohonanAkses";
// import CekTahapanDokumen from "./admin/CekTahapanDokumen";
// import DetailTahapanDokumen from "./admin/DetailTahapanDokumen";
// import ValidasiVerifikasi from "./admin/Validasi"; 
// import Settings from "./admin/Settings";


// // Layout Pembungkus untuk Halaman User/Publik
// function UserLayout() {
//   return (
//     <>
//       <Navbar />
//       <div className="main-content"> 
//         <Outlet />
//       </div>
//     </>
//   );
// }

// // Layout Pembungkus untuk Halaman Admin
// function AdminLayout() {
//     return <NavbarAdmin />;
// }

// export default function App() {
//   return (
//     <Router>
//         {/* Hapus ToastContainer */}
//       <Routes>
//         
//         {/* ============================================== */}
//         {/* 1. RUTE PUBLIK & USER (Menggunakan UserLayout) */}
//         {/* ============================================== */}
//         <Route element={<UserLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/daftar" element={<Daftar />} />
//           <Route path="/login" element={<Login />} />
//           
//           {/* Rute Dashboard User (Role: user) */}
//           <Route 
//             path="/dashboard" 
//             element={<RequireAuth allowedRoles={["user"]}><UserDashboard /></RequireAuth>} 
//           />

//           {/* Rute Riwayat Pengajuan (Role: user) */}
//           <Route 
//             path="/pengajuan" 
//             element={<RequireAuth allowedRoles={["user"]}><Pengajuan /></RequireAuth>} 
//           />
          
//         </Route>


//         {/* ============================================== */}
//         {/* 2. RUTE ADMIN DASHBOARD (PROTECTED - Role: Admin) */}
//         {/* ============================================== */}
//         <Route path="/admin" element={<AdminLayout />}>
//             {/* Index Admin: Redirect ke Dashboard */}
//             <Route index element={<Navigate to="dashboard" replace />} />
            
//             {/* Menerapkan RequireAuth pada setiap elemen rute admin (Role: admin SAJA) */}
//             <Route 
//                 path="dashboard" 
//                 element={<RequireAuth allowedRoles={["admin"]}><Dashboard /></RequireAuth>} 
//             />
//             <Route 
//                 path="manajemen-user" 
//                 element={<RequireAuth allowedRoles={["admin"]}><ManajemenUser /></RequireAuth>} 
//             />
//             <Route 
//                 path="log-activity" 
//                 element={<RequireAuth allowedRoles={["admin"]}><LogActivity /></RequireAuth>} 
//             />
//             <Route 
//                 path="permohonan-akses" 
//                 element={<RequireAuth allowedRoles={["admin"]}><PermohonanAksesData /></RequireAuth>} 
//             />
//             {/* Rute Tambah Permohonan (Role: admin, user) */}
//             <Route 
//                 path="tambah-permohonan" 
//                 element={<RequireAuth allowedRoles={["admin", "user"]}><TambahPermohonanAkses /></RequireAuth>} 
//             /> 
//             <Route 
//                 path="cek-tahapan" 
//                 element={<RequireAuth allowedRoles={["admin"]}><CekTahapanDokumen /></RequireAuth>} 
//             />
//             <Route 
//                 path="detail-tahapan" 
//                 element={<RequireAuth allowedRoles={["admin"]}><DetailTahapanDokumen /></RequireAuth>} 
//             />
//             <Route 
//                 path="validasi" 
//                 element={<RequireAuth allowedRoles={["admin"]}><ValidasiVerifikasi /></RequireAuth>} 
//             />
//             <Route 
//                 path="settings" 
//                 element={<RequireAuth allowedRoles={["admin"]}><Settings /></RequireAuth>} 
//             />
//         </Route>
//         
//         {/* 3. Rute Catch-All (404 Not Found) */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";

// --- Components & Layouts ---
import Navbar from "./components/Navbar";
// FIX KRITIS: Ganti dari "./components/RequireAuth" menjadi "./config/RequireAuth.jsx"
import RequireAuth from "./config/RequireAuth.jsx"; 
import NavbarAdmin from "./admin/NavbarAdmin";

// --- Pages (User/Public) ---
import Home from "./pages/Home";
import Daftar from "./pages/Daftar";
import Login from "./pages/Login";
import Pengajuan from "./pages/Pengajuan"; // Riwayat Pengajuan User (TIDAK DIPAKAI DI USER DASHBOARD BARU)
// Import UserDashboard yang sekarang menjadi dashboard fungsional
import UserDashboard from "./pages/UserDashboard";

// --- Pages (Admin) ---
import Dashboard from "./admin/Dashboard";
import ManajemenUser from "./admin/ManajemenUser";
import LogActivity from "./admin/LogActivity";
import PermohonanAksesData from "./admin/PermohonanAksesData";
import TambahPermohonanAkses from "./admin/TambahPermohonanAkses";
import CekTahapanDokumen from "./admin/CekTahapanDokumen";
import DetailTahapanDokumen from "./admin/DetailTahapanDokumen";
import ValidasiVerifikasi from "./admin/Validasi"; 
import Settings from "./admin/Settings";


// Layout Pembungkus untuk Halaman User/Publik
function UserLayout() {
  return (
    <>
      <Navbar />
      <div className="main-content"> 
        <Outlet />
      </div>
    </>
  );
}

// Layout Pembungkus untuk Halaman Admin
function AdminLayout() {
    return <NavbarAdmin />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* ============================================== */}
        {/* 1. RUTE PUBLIK & USER (Menggunakan UserLayout) */}
        {/* ============================================== */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rute Dashboard User (Role: user, admin, sekda) */}
          <Route 
            path="/user/dashboard" 
            element={<RequireAuth allowedRoles={["user", "admin", "sekda"]}><UserDashboard /></RequireAuth>} 
          />

          {/* Rute Riwayat Pengajuan LAMA (Redirect ke /user/dashboard) */}
          <Route 
            path="/pengajuan" 
            element={<Navigate to="/user/dashboard" replace />} 
          />
          
        </Route>


        {/* ============================================== */}
        {/* 2. RUTE ADMIN DASHBOARD (PROTECTED - Role: Admin/Sekda) */}
        {/* ============================================== */}
        <Route path="/admin" element={<AdminLayout />}>
            {/* Index Admin: Redirect ke Dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Menerapkan RequireAuth pada setiap elemen rute admin (Role: admin SAJA, kecuali Tambah Permohonan) */}
            <Route 
                path="dashboard" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><Dashboard /></RequireAuth>} 
            />
            <Route 
                path="manajemen-user" 
                element={<RequireAuth allowedRoles={["admin"]}><ManajemenUser /></RequireAuth>} 
            />
            <Route 
                path="log-activity" 
                element={<RequireAuth allowedRoles={["admin"]}><LogActivity /></RequireAuth>} 
            />
            <Route 
                path="permohonan-akses" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><PermohonanAksesData /></RequireAuth>} 
            />
            {/* Rute Tambah Permohonan (Role: admin, user, sekda) */}
            <Route 
                path="tambah-permohonan" 
                element={<RequireAuth allowedRoles={["admin", "user", "sekda"]}><TambahPermohonanAkses /></RequireAuth>} 
            /> 
            <Route 
                path="cek-tahapan" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><CekTahapanDokumen /></RequireAuth>} 
            />
            <Route 
                path="detail-tahapan" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><DetailTahapanDokumen /></RequireAuth>} 
            />
            <Route 
                path="validasi" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><ValidasiVerifikasi /></RequireAuth>} 
            />
            <Route 
                path="settings" 
                element={<RequireAuth allowedRoles={["admin"]}><Settings /></RequireAuth>} 
            />
            {/* Rute Admin lainnya, seperti Monitoring, Kebijakan Akses, dll., perlu ditambahkan di sini */}
            <Route 
                path="monitoring" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><div>Monitoring Data (Coming Soon)</div></RequireAuth>} 
            />
            <Route 
                path="kebijakan-akses" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><div>Kebijakan Akses (Coming Soon)</div></RequireAuth>} 
            />

        </Route>
        
        {/* 3. Rute Catch-All (404 Not Found) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
