import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth"; 
import "../styles/navbar.css";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  
  // ✅ FIX KRITIS 1: Inisialisasi state user dengan data sesi
  const [user, setUser] = useState(getCurrentUser()); 

  // Data dummy notifikasi (disederhanakan)
  const notifications = [
    { id: 1, title: "Pengajuan Disetujui", content: "Permohonan data Anda telah disetujui.", date: "1 hari lalu" },
    { id: 2, title: "Menunggu Verifikasi", content: "Dokumen Anda sedang dalam tahap verifikasi teknis.", date: "3 hari lalu" },
  ];

  // Efek untuk memuat user dan mendengarkan perubahan sesi
  useEffect(() => {
    // Fungsi untuk memuat user dari sesi lokal
    const loadUser = () => {
        setUser(getCurrentUser());
    };
    
    // Dengarkan event kustom 'userChanged' setelah login/logout
    window.addEventListener('userChanged', loadUser);

    // Bersihkan listener saat komponen dilepas
    return () => {
        window.removeEventListener('userChanged', loadUser);
    };
  }, []); 

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);
  
  // ✅ FIX 2: Handler Logout
  const handleLogout = () => {
    logoutUser(); // Panggil fungsi logout yang menghapus cookie & local storage
    setIsDropdownOpen(false);
    // Navigasi ke rute publik
    navigate("/"); 
  };
  
  // Menu item utama (HANYA BERANDA)
  const menuItems = [
    { name: "Beranda", path: "/" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Brand / Logo */}
          <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span>DTSEN</span>
          </div>

          {/* Menu & Auth Buttons */}
          <div className="menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `menu-item ${isActive ? "active" : ""}`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Jika sudah login */}
            {user ? (
              <>
                {/* Notifikasi Button */}
                <button 
                  className="button-notifikasi" 
                  onClick={toggleNotif}
                  style={{ color: 'white' }} 
                >
                  🔔
                </button>

                {/* Profile Button */}
                <div className="profile-container">
                  <button className="profile-btn" onClick={toggleDropdown} style={{ color: 'white' }}>
                    👤
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <span className="dropdown-item" style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', cursor: 'default' }}>
                        {user.nama || 'Pengguna'}
                      </span>
                      
                      {/* Navigasi ke Dashboard/Home yang sesuai */}
                      <button 
                        className="dropdown-item" 
                        onClick={() => {
                            setIsDropdownOpen(false);
                            if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'sekda') {
                                navigate("/admin/dashboard");
                            } else {
                                navigate("/");
                            }
                        }}
                      >
                          Dashboard
                      </button>
                      
                      <button 
                        className="dropdown-item" 
                        onClick={() => {
                            setIsDropdownOpen(false);
                            navigate("/user/profile"); // Rute mock, bisa diubah
                        }}
                      >
                          Profil
                      </button>

                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                      >
                          Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Login/Daftar button untuk belum login
              <>
                <button
                  className="daftar-btn"
                  onClick={() => navigate("/daftar")}
                >
                  Daftar
                </button>
                <button
                  className="login-btn"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Notifikasi Panel (Modal/Sidebar) */}
      {isNotifOpen && (
        <>
          <div className="notif-overlay" onClick={toggleNotif}></div>
          <div className={`notif-panel ${isNotifOpen ? 'open' : ''}`}>
            <div className="notif-header">
              <h3>Notifikasi ({notifications.length})</h3>
              <button className="notif-close-btn" onClick={toggleNotif}>&times;</button>
            </div>
            <div className="notif-list">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="notif-card">
                    <h4>{notif.title}</h4>
                    <p>{notif.content}</p>
                    <span className="notif-date">{notif.date}</span>
                  </div>
                ))
              ) : (
                <p className="no-notif">Tidak ada notifikasi baru.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}