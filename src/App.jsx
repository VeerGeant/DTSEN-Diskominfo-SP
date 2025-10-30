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
// FIX KRITIS: Ganti dari "./components/RequireAuth" menjadi "./config/RequireAuth.jsx"
import Navbar from "./components/Navbar";
import NavbarUsers from "./dashboard/Navbar";
import RequireAuth from "./config/RequireAuth.jsx"; 

// --- Pages (User/Public) ---
import Home from "./pages/Home";
import Daftar from "./pages/Daftar";
import Login from "./pages/Login";
import Pengajuan from "./pages/Pengajuan"; // Riwayat Pengajuan User (TIDAK DIPAKAI DI USER DASHBOARD BARU)
// Import UserDashboard yang sekarang menjadi dashboard fungsional
import DashboardUser from "./dashboard/Dashboard.jsx";


// --- Pages (Admin) ---
import NavbarAdmin from "./admin/NavbarAdmin";
import Dashboard from "./admin/Dashboard";
import ManajemenUser from "./admin/ManajemenUser";
import LogActivity from "./admin/LogActivity";
import ValidasiVerifikasi from "./admin/Validasi"; 
import Settings from "./components/Settings.jsx";
import TambahPermohonanAkses from "./admin/TambahPermohonanAkses";
import SetTahapanDokumen from "./admin/SetTahapanDokumen.jsx";
import VerifikasiTahapan from "./admin/VerifikasiTahapan.jsx";
import ListTahapan from "./admin/ListTahapan.jsx";
import SetDetailTahapanDokumen from "./admin/SetDetailTahapanDokumen.jsx";
import SetPermohonanAksesData from "./admin/SetPermohonanAksesData.jsx";


// --- Pages (User) ---
import CekTahapanDokumen from "./dashboard/CekTahapanDokumen.jsx";
import PermohonanAksesData from "./dashboard/PermohonanAksesData";
import DetailTahapanDokumen from "./dashboard/DetailTahapanDokumen.jsx";



// Layout Pembungkus untuk Halaman User/Publik
function Layout() {
  return (
    <>
      <Navbar />
      
        <Outlet />
      
    </>
  );
}
function UserLayout() {
  return (
    <>
      <NavbarUsers />
      
      
   
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
        {/* 1. RUTE PUBLIK & USER (Menggunakan Layout) */}
        {/* ============================================== */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ============================================== */}
        {/* 2. RUTE Dashaborad USER (Menggunakan UserLayout) */}
        {/* ============================================== */}   
        <Route path="user" element={<UserLayout />}>
            <Route 
                path="cek-tahapan" 
                element={<RequireAuth allowedRoles={["user", "sekda"]}><CekTahapanDokumen /></RequireAuth>} 
            />
            <Route 
                path="detail-tahapan" 
                element={<RequireAuth allowedRoles={["user", "sekda"]}><DetailTahapanDokumen /></RequireAuth>} 
            />
            <Route 
                path="permohonan-akses" 
                element={<RequireAuth allowedRoles={["user", "sekda"]}><PermohonanAksesData /></RequireAuth>} 
            />
            <Route 
                path="dashboard" 
                element={<RequireAuth allowedRoles={["user", "sekda"]}><DashboardUser /></RequireAuth>} 
            />
            
        </Route>


        {/* ============================================== */}
        {/* 3. RUTE ADMIN DASHBOARD (PROTECTED - Role: Admin/Sekda) */}
        {/* ============================================== */}
        <Route path="/admin" element={<AdminLayout />}>
            {/* Index Admin: Redirect ke Dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Menerapkan RequireAuth pada setiap elemen rute admin (Role: admin SAJA, kecuali Tambah Permohonan) */}
            <Route 
                path="set-tahapan" 
                element={<RequireAuth allowedRoles={["admin"]}><SetTahapanDokumen /></RequireAuth>} 
            />
            <Route 
                path="detail-tahapan" 
                element={<RequireAuth allowedRoles={["admin"]}><SetDetailTahapanDokumen /></RequireAuth>} 
            />
            <Route 
                path="permohonan-akses" 
                element={<RequireAuth allowedRoles={["admin"]}><SetPermohonanAksesData /></RequireAuth>} 
            />
            <Route 
                path="dashboard" 
                element={<RequireAuth allowedRoles={["admin"]}><Dashboard /></RequireAuth>} 
            />
            <Route 
                path="manajemen-user" 
                element={<RequireAuth allowedRoles={["admin"]}><ManajemenUser /></RequireAuth>} 
            />
            <Route 
                path="log-activity" 
                element={<RequireAuth allowedRoles={["admin"]}><LogActivity /></RequireAuth>} 
            />
            {/* Rute Tambah Permohonan (Role: admin, user, sekda) */}
            <Route 
                path="tambah-permohonan" 
                element={<RequireAuth allowedRoles={["admin"]}><TambahPermohonanAkses /></RequireAuth>} 
            /> 
            <Route 
                path="validasi" 
                element={<RequireAuth allowedRoles={["admin"]}><ValidasiVerifikasi /></RequireAuth>} 
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
            <Route 
                path="verifikasi-tahapan" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><VerifikasiTahapan /></RequireAuth>} 
            />
            <Route 
                path="list-tahapan" 
                element={<RequireAuth allowedRoles={["admin", "sekda"]}><ListTahapan /></RequireAuth>} 
            />
            

        </Route>
        
        {/* 3. Rute Catch-All (404 Not Found) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
