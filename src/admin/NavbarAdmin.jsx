import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSubmenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);

  const handleConfirmLogout = () => {
    logoutUser();
    navigate('/');
  };

  // AUTO OPEN SUBMENU ketika user ada di dalam path submenu
  useEffect(() => {
    if (location.pathname.includes("permohonan-akses") || location.pathname.includes("monitoring")) {
      setOpenMenu("layanan");
    }
    if (location.pathname.includes("set-tahapan")) {
      setOpenMenu("progres");
    }
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="left-section">
          <img className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', height: '48px' }} alt="Logo" />
          <button className="toggle-button" onClick={toggleSidebar}>☰</button>
        </div>
        <div className="right-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="current-time">{currentTime}</span>
          <span className="title-label" style={{ fontWeight: 700 }}>DTSEN Dashboard</span>
        </div>
      </header>

      <nav className={`app-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-profile">
          <img src="https://i.pravatar.cc/100" alt="Admin Profile" />
          <span>Admin DTSEN</span>
          <button className="profile-button" onClick={() => navigate('/admin/profile')}>
            Lihat Profil
          </button>
        </div>

        {/* ================= MENU UTAMA ================= */}
        <Link
          to="/admin/dashboard"
          className={`sidebar-link ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          Beranda
        </Link>

        {/* ================= LAYANAN ================= */}
        <div className="sidebar-menu-item">
          <button
            className={`sidebar-link submenu-toggle ${openMenu === 'layanan' ? "active" : ""}`}
            onClick={() => toggleSubmenu('layanan')}
          >
            Layanan
            <span className={`arrow ${openMenu === 'layanan' ? 'rotate' : ''}`}>▾</span>
          </button>

          {openMenu === 'layanan' && (
            <div className="submenu">
              <Link
                to="/admin/permohonan-akses"
                className={`submenu-link ${location.pathname === "/admin/permohonan-akses" ? "active" : ""}`}
              >
                Permohonan Akses
              </Link>

              <div className="submenu-link disabled">
                Unduh Data <span className="tag-upcoming">(Coming Soon)</span>
              </div>

              <Link
                to="/admin/monitoring"
                className={`submenu-link ${location.pathname === "/admin/monitoring" ? "active" : ""}`}
              >
                Monitoring
              </Link>
            </div>
          )}
        </div>

        {/* ================= PROGRES ================= */}
        <div className="sidebar-menu-item">
          <button
            className={`sidebar-link submenu-toggle ${openMenu === 'progres' ? "active" : ""}`}
            onClick={() => toggleSubmenu('progres')}
          >
            Progres Data
            <span className={`arrow ${openMenu === 'progres' ? 'rotate' : ''}`}>▾</span>
          </button>

          {openMenu === 'progres' && (
            <div className="submenu">
              <Link
                to="/admin/set-tahapan"
                className={`submenu-link ${location.pathname === "/admin/set-tahapan" ? "active" : ""}`}
              >
                Cek Tahapan Dokumen
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/admin/list-tahapan"
          className={`sidebar-link ${location.pathname === "/admin/list-tahapan" ? "active" : ""}`}
        >
          Verifikasi Tahapan
        </Link>

        <Link
          to="/admin/kebijakan-akses"
          className={`sidebar-link ${location.pathname === "/admin/kebijakan-akses" ? "active" : ""}`}
        >
          Kebijakan Akses
        </Link>

        <Link
          to="/admin/settings"
          className={`sidebar-link ${location.pathname === "/admin/settings" ? "active" : ""}`}
        >
          Settings
        </Link>

        <button className="logout-button" onClick={() => setShowLogoutConfirm(true)}>
          Logout
        </button>
      </nav>

      <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <Outlet />
      </main>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div className="logout-buttons">
              <button className="btn-yes" onClick={handleConfirmLogout}>Ya, Logout</button>
              <button className="btn-no" onClick={() => setShowLogoutConfirm(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
