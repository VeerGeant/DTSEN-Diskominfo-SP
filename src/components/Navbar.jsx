import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser, logoutUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getCurrentUser());
    }

    const handleUserChange = () => {
      if (isLoggedIn()) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };

    
    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    setIsNotifOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Pengajuan", path: "/pengajuan" },
  ];

  const notifications = [
    {
      id: 1,
      title: "Pengajuan Diterima",
      message: "Pengajuan Data Sosial 2025 telah divalidasi.",
      date: "08 Okt 2025",
    },
    {
      id: 2,
      title: "Pengajuan Diproses",
      message: "Data Bantuan Ekonomi sedang diproses.",
      date: "05 Okt 2025",
    },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => navigate("/")}>
            <span>DTSEN</span>
          </div>

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

            {/* Jika belum login */}
            {!user ? (
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
            ) : (
              <>
                
                <button
                  className="button-notifikasi"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                >
                  🔔
                </button>

                {/* 👤 Dropdown Profil */}
                <div className="profile-menu">
                  <button
                    className="profile-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    👤
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <p>{user?.username || "Pengguna"}</p>
                      <button onClick={() => navigate("/profil")}>Profil</button>
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 📨 Overlay dan Panel Notifikasi */}
      {isNotifOpen && (
        <>
          <div
            className="notif-overlay"
            onClick={() => setIsNotifOpen(false)}
          ></div>

          <div className={`notif-panel ${isNotifOpen ? "open" : ""}`}>
            <div className="notif-header">
              <h3>Notifikasi</h3>
              <button
                className="notif-close-btn"
                onClick={() => setIsNotifOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="notif-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="notif-card">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notif-date">{notif.date}</span>
                  </div>
                ))
              ) : (
                <p className="no-notif">Belum ada notifikasi</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
