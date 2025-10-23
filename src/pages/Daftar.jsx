import React from "react";
import { useNavigate } from "react-router-dom";


export default function Daftar() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pendaftaran berhasil (contoh simulasi).");
  };

  return (
    <div className="daftar-page">
      {/* Bagian kiri: form */}
      <div className="form-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 
        </button>

        <h1 className="brand-title">DTSEN</h1>
        <h2 className="form-title">Buat Akun Baru</h2>

        <form className="daftar-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama lengkap" required />
          </div>

          <div className="form-group">
            <label>NIP</label>
            <input type="text" placeholder="Masukkan NIP" required />
          </div>

          <div className="form-group">
            <label>Jabatan</label>
            <input type="text" placeholder="Masukkan jabatan" required />
          </div>

          <div className="form-group">
            <label>Instansi</label>
            <input type="text" placeholder="Masukkan instansi" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Masukkan email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Masukkan password" required />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select required>
              <option value="">Pilih Role</option>
              <option value="admin">OPD</option>
              <option value="pegawai">Sekda</option>
              <option value="user">User</option>
            </select>
          </div>

          <button type="submit" className="daftar-btn">
            Daftar
          </button>

          <p className="login-text">
            Sudah punya akun?{" "}
            <span onClick={() => navigate("/login")} className="login-link">
              Login
            </span>
          </p>
        </form>
      </div>

      {/* Bagian kanan: gambar/info */}
      <div className="info-container">
        <div className="info-content">
          <h2>Selamat Datang di DTSEN</h2>
          <p>
            Platform layanan data sosial dan ekonomi nasional.  
            Daftar sekarang untuk mengakses berbagai fitur.
          </p>
        </div>
      </div>
    </div>
  );
}
