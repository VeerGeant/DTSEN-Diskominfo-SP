import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null); // kontrol submenu

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const toggleSubmenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="admin-layout">
      
      <header className="admin-header">
        <div className="left-section">
          <img
            src="https://res.cloudinary.com/dffkscge9/image/upload/v1749892130/SNA_Logo_By_Kekey_1000_x_1000_2_1_soynpu.png"
            alt="Logo"
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', height: '48px' }}
          />
          <button className="toggle-button" onClick={toggleSidebar}>☰</button>
        </div>
        <div className="right-section">
          <span className="title-label">DTSEN Dashboard</span>
        </div>
      </header>

      
      <nav className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-profile">
          <img src="https://i.pravatar.cc/100" alt="Admin Profile" />
          <span>Admin DTSEN</span>
          <button
            className="profile-button"
            onClick={() => navigate('/admin/profile')}
          >
            Lihat Profil
          </button>
        </div>

        <Link to="/admin/dashboard" className="sidebar-link">Beranda</Link>

        
        <div className="sidebar-menu">
          <button
            className="sidebar-link submenu-toggle"
            onClick={() => toggleSubmenu('layanan')}
          >
            Layanan
            <span className={`arrow ${openMenu === 'layanan' ? 'rotate' : ''}`}>▾</span>
          </button>

          {openMenu === 'layanan' && (
            <div className="submenu">
              <Link to="/admin/permohonan-akses" className="submenu-link">
                Permohonan Akses
              </Link>

              {/* Unduh Data - upcoming feature */}
              <div className="submenu-link disabled">
                Unduh Data <span className="tag-upcoming">(Coming Soon)</span>
              </div>

              <Link to="/admin/monitoring" className="submenu-link">
                Monitoring
              </Link>
            </div>
          )}
        </div>

        
        <div className="sidebar-menu">
          <button className="sidebar-link submenu-toggle" onClick={() => toggleSubmenu('progres')}>
            Progres Data
            <span className={`arrow ${openMenu === 'progres' ? 'rotate' : ''}`}>▾</span>
          </button>
          {openMenu === 'progres' && (
            <div className="submenu">
              <Link to="/admin/cek-tahapan" className="submenu-link">Cek Tahapan Dokumen</Link>
            </div>
          )}
        </div>

        <Link to="/admin/kebijakan-akses" className="sidebar-link">Kebijakan Akses</Link>
        <Link to="/admin/settings" className="sidebar-link">Settings</Link>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Konten utama */}
      <main className={`admin-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <Outlet />
      </main>
    </div>
  );
}
