import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { loginUser } from "../utils/auth"; // import fungsi dari utils/auth.js

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!isChecked) {
      setError("Harap centang captcha terlebih dahulu");
      return;
    }

    const success = loginUser(username, password);

    if (success) {
      navigate("/"); // arahkan ke halaman utama
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>

        <h1 className="brand">DTSEN</h1>
        <h2 className="login-title">Login to your account</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="captcha-box">
            <div className="captcha-left">
              <input
                type="checkbox"
                id="captcha"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label htmlFor="captcha">I'm not a robot</label>
            </div>
            <img
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
              alt="captcha logo"
              className="captcha-logo"
            />
          </div>

          <div className="form-options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">
              Forgot password?
            </a>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn-2">
            Login
          </button>

          <p className="register-text">
            Belum punya akun? <a href="#">Daftar</a>
          </p>
        </form>
      </div>

      <div className="login-image">
        <div className="overlay">
          <h2>Welcome to DTSEN</h2>
          <p>Platform pengajuan digital yang mudah dan cepat.</p>
        </div>
      </div>
    </div>
  );
}
