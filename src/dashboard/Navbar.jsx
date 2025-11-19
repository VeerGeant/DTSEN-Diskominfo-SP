import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null); // kontrol submenu

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/dashboard');
  };

  const toggleSubmenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="app-layout">
      
      <header className="app-header"> {/* Renamed from admin-header */}
        <div className="left-section">
          <img
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', height: '48px' }}
            alt="Logo"
          />
          <button className="toggle-button" onClick={toggleSidebar}>☰</button>
        </div>
        <div className="right-section">
          <span className="title-label">DTSEN Dashboard</span>
        </div>
      </header>

      
      <nav className={`app-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}> {/* Renamed from admin-sidebar */}
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

        <Link to="/user/dashboard" className="sidebar-link">Beranda</Link>

        
        <div className="sidebar-menu-item"> {/* Renamed from sidebar-menu for more clarity */}
          <button
            className="sidebar-link submenu-toggle"
            onClick={() => toggleSubmenu('layanan')}
          >
            Layanan
            <span className={`arrow ${openMenu === 'layanan' ? 'rotate' : ''}`}>▾</span>
          </button>

          {openMenu === 'layanan' && (
            <div className="submenu">
              <Link to="/user/permohonan-akses" className="submenu-link">
                Permohonan Akses
              </Link>

              {/* Unduh Data - upcoming feature */}
              <div className="submenu-link disabled">
                Unduh Data <span className="tag-upcoming">(Coming Soon)</span>
              </div>

              
            </div>
          )}
        </div>

        
        <div className="sidebar-menu-item"> {/* Renamed from sidebar-menu */}
          <button className="sidebar-link submenu-toggle" onClick={() => toggleSubmenu('progres')}>
            Progres Data
            <span className={`arrow ${openMenu === 'progres' ? 'rotate' : ''}`}>▾</span>
          </button>
          {openMenu === 'progres' && (
            <div className="submenu">
              <Link to="cek-tahapan-user" className="submenu-link">Cek Tahapan Dokumen</Link>
            </div>
          )}
        </div>

        <Link to="/user/kebijakan-akses" className="sidebar-link">Kebijakan Akses</Link>
        <Link to="/user/settings" className="sidebar-link">Settings</Link>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Konten utama */}
      <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}> {/* Renamed from admin-content */}
        <Outlet />
      </main>
    </div>
  );
}