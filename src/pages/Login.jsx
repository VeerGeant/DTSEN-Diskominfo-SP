

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  requestLoginOtp,
  verifyOtpAndLogin,
  isLoggedIn,
} from "../utils/auth";

const STEP = {
  EMAIL: "email",
  OTP: "otp",
};

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otpCode: "",
  });
  const [step, setStep] = useState(STEP.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { email, password, otpCode } = formData;

  useEffect(() => {
    if (isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        if (user.role === "admin" || user.role === "sekda") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "user") {
          navigate("/user/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginStep1 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Email dan Password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    const result = await requestLoginOtp(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMessage("OTP telah dikirim ke email Anda.");
      setStep(STEP.OTP);
    } else {
      setError(result.message);
    }
  };

  const handleLoginStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otpCode) {
      setError("Kode OTP tidak boleh kosong.");
      return;
    }

    setLoading(true);
    const result = await verifyOtpAndLogin(email, otpCode);
    setLoading(false);

    if (result.success) {
      const user = result.user;

      if (user.role === "admin" || user.role === "sekda") {
        navigate("/admin/dashboard");
      } else if (user.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      {/* Kiri: Form login */}
      <div className="login-container">
        <button className="back-btn" onClick={() => navigate("/")}>
          ←
        </button>
        <div className="brand">NusaTinggi</div>
        <h1 className="login-title">
          {step === STEP.EMAIL ? "Login Akun" : "Verifikasi OTP"}
        </h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Langkah 1: Email & Password */}
        {step === STEP.EMAIL && (
          <form className="login-form" onSubmit={handleLoginStep1}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Masukkan email terdaftar Anda"
              required
              disabled={loading}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              required
              disabled={loading}
            />

            <div className="form-options">
              <div></div>
              <Link to="/forgot" className="forgot">
                Lupa Password?
              </Link>
            </div>

            {/* Simulasi Captcha */}
            <div className="captcha-box">
              <div className="captcha-left">
                <input type="checkbox" id="captcha" />
                <label htmlFor="captcha">Saya bukan robot</label>
              </div>
              <img
                className="captcha-logo"
                src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                alt="captcha"
              />
            </div>

            <button type="submit" className="login-btn-2" disabled={loading}>
              {loading ? "Memuat..." : "Minta Kode OTP"}
            </button>
          </form>
        )}

        {/* Langkah 2: OTP */}
        {step === STEP.OTP && (
          <form className="login-form" onSubmit={handleLoginStep2}>
            <p className="otp-info">
              Kode OTP telah dikirim ke <strong>{email}</strong>.
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setStep(STEP.EMAIL);
                  setError("");
                  setSuccessMessage("");
                  setFormData({ ...formData, otpCode: "" });
                }}
                style={{ marginLeft: "5px" }}
              >
                Ganti Email
              </Link>
            </p>

            <label htmlFor="otpCode">Kode OTP</label>
            <input
              type="text"
              id="otpCode"
              name="otpCode"
              value={otpCode}
              onChange={handleChange}
              placeholder="Masukkan kode OTP"
              maxLength="6"
              required
              disabled={loading}
            />

            <button type="submit" className="login-btn-2" disabled={loading}>
              {loading ? "Memuat..." : "Verifikasi & Login"}
            </button>
          </form>
        )}

        <p className="register-text">
          Belum punya akun? <Link to="/daftar">Daftar sekarang</Link>
        </p>
      </div>

      {/* Kanan: Gambar / background */}
      <div className="login-image">
        <div className="overlay">
          <h2>Selamat Datang di NusaTinggi</h2>
          <p>
            Temukan pengalaman mendaki terbaik dan jelajahi keindahan alam
            Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}
