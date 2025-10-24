import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/auth"; // Import fungsi registerUser

export default function Daftar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    instansi: "",
    no_hp: "", // Tambah field Nomor HP
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
    setSuccess(""); // Clear success message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Cek apakah semua field terisi
    const requiredFields = ["nama", "nip", "jabatan", "instansi", "no_hp", "email", "password"];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== "");

    if (!isFormValid) {
        setError("Semua kolom harus diisi.");
        setLoading(false);
        return;
    }
    
    // Panggil fungsi API registrasi
    const result = await registerUser(formData);

    setLoading(false);

    if (result.success) {
      setSuccess(result.message); // Pesan dari backend: "Registrasi berhasil, menunggu persetujuan admin."
      // Opsional: bersihkan form setelah sukses
      setFormData({
        nama: "", nip: "", jabatan: "", instansi: "",
        no_hp: "", email: "", password: "",
      });
      // Arahkan ke halaman login setelah beberapa saat
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      // Tampilkan pesan error dari backend (misal: Email sudah terdaftar)
      setError(result.message); 
    }
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
          
          {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
          {success && <p className="success-text" style={{ color: 'green' }}>{success}</p>}

          <div className="form-group">
            <label>Nama Lengkap</label>
            <input 
              type="text" 
              name="nama"
              placeholder="Masukkan nama lengkap" 
              value={formData.nama}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>NIP</label>
            <input 
              type="text" 
              name="nip"
              placeholder="Masukkan NIP" 
              value={formData.nip}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Jabatan</label>
            <input 
              type="text" 
              name="jabatan"
              placeholder="Masukkan jabatan" 
              value={formData.jabatan}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Instansi</label>
            <input 
              type="text" 
              name="instansi"
              placeholder="Masukkan instansi" 
              value={formData.instansi}
              onChange={handleChange}
              required 
            />
          </div>
          
          {/* Tambahkan field Nomor HP */}
          <div className="form-group">
            <label>Nomor HP</label>
            <input 
              type="text" 
              name="no_hp"
              placeholder="Masukkan nomor HP" 
              value={formData.no_hp}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Masukkan email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Masukkan password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          {/* Hapus bagian Role Selection, karena role di-set otomatis di backend */}
          {/* <div className="form-group">
            <label>Role</label>
            <select required>
              <option value="">Pilih Role</option>
              <option value="opd">OPD</option>
              <option value="sekda">Sekda</option>
              <option value="user">User</option>
            </select>
          </div> */}

          <button 
            type="submit" 
            className="daftar-btn"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Daftar"}
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