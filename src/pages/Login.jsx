// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import {
// //   requestLoginOtp,
// //   verifyOtpAndLogin,
// //   isLoggedIn,
// // } from "../utils/auth";
// // import "../styles/login.css"; // Pastikan path ini benar

// // const Login = () => {
// //   const navigate = useNavigate();
// //   // State untuk menangani langkah login: 1 (Form Login) atau 2 (Form OTP)
// //   const [step, setStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     email: "", // Diubah dari 'username' menjadi 'email'
// //     password: "",
// //   });
// //   const [otpCode, setOtpCode] = useState("");
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [successMessage, setSuccessMessage] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleOtpChange = (e) => {
// //     setOtpCode(e.target.value);
// //   };

// //   // Handler untuk Langkah 1: Mengirim Email/Password dan meminta OTP
// //   const handleLoginStep1 = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccessMessage("");
// //     setLoading(true);

// //     const { email, password } = formData;

// //     // Panggil API untuk meminta OTP
// //     const result = await requestLoginOtp(email, password);

// //     setLoading(false);

// //     if (result.success) {
// //       setSuccessMessage(result.message || "Kode OTP telah dikirim ke email Anda.");
// //       setStep(2); // Lanjut ke langkah verifikasi OTP
// //     } else {
// //       setError(result.message);
// //     }
// //   };

// //   // Handler untuk Langkah 2: Mengirim OTP untuk login
// //   const handleLoginStep2 = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     const { email } = formData;

// //     // Panggil API untuk memverifikasi OTP dan membuat sesi
// //     const result = await verifyOtpAndLogin(email, otpCode);

// //     setLoading(false);

// //     if (result.success) {
// //       // Login berhasil
// //       // Cek role user dan arahkan ke dashboard yang sesuai
// //       const user = result.user;
// //       if (user.role === "admin" || user.role === "sekda") {
// //         navigate("/admin/dashboard");
// //       } else {
// //         navigate("/");
// //       }
// //     } else {
// //       setError(result.message);
// //     }
// //   };

// //   // Tampilan Form Login (Langkah 1)
// //   const renderLoginForm = () => (
// //     <div className="login-box">
// //       <form onSubmit={handleLoginStep1}>
// //         <h2>LOGIN</h2>
// //         {error && <p className="error-message">{error}</p>}
// //         {successMessage && (
// //           <p className="success-message">{successMessage}</p>
// //         )}
// //         <div className="form-group">
// //           <input
// //             type="email"
// //             id="email"
// //             name="email"
// //             value={formData.email}
// //             onChange={handleChange}
// //             placeholder="Email"
// //             required
// //             aria-label="Email"
// //           />
// //         </div>
// //         <div className="form-group">
// //           <input
// //             type="password"
// //             id="password"
// //             name="password"
// //             value={formData.password}
// //             onChange={handleChange}
// //             placeholder="Password"
// //             required
// //             aria-label="Password"
// //           />
// //         </div>
// //         <button type="submit" className="login-btn" disabled={loading}>
// //           {loading ? "Memuat..." : "Masuk"}
// //         </button>
// //         <p className="text-center mt-3">
// //           Belum punya akun? <Link to="/daftar">Daftar</Link>
// //         </p>
// //       </form>
// //     </div>
// //   );

// //   // Tampilan Form OTP (Langkah 2)
// //   const renderOtpForm = () => (
// //     <div className="login-box">
// //       <form onSubmit={handleLoginStep2}>
// //         <h2>Verifikasi OTP</h2>
// //         <p className="otp-info">
// //           Masukkan kode OTP yang telah dikirimkan ke **{formData.email}**.
// //         </p>
// //         {error && <p className="error-message">{error}</p>}
// //         <div className="form-group">
// //           <input
// //             type="text"
// //             id="otp_code"
// //             name="otp_code"
// //             value={otpCode}
// //             onChange={handleOtpChange}
// //             placeholder="Kode OTP (6 digit)"
// //             maxLength="6"
// //             required
// //             aria-label="Kode OTP"
// //           />
// //         </div>
// //         <button type="submit" className="login-btn" disabled={loading}>
// //           {loading ? "Memverifikasi..." : "Verifikasi & Masuk"}
// //         </button>
// //         <p className="text-center mt-3">
// //           <a href="#" onClick={() => setStep(1)}>
// //             Kembali ke Login
// //           </a>
// //         </p>
// //       </form>
// //     </div>
// //   );

// //   return (
// //     <div className="login-container">
// //       {step === 1 ? renderLoginForm() : renderOtpForm()}
// //     </div>
// //   );
// // };

// // export default Login;
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// // Pastikan Anda mengimpor fungsi autentikasi dari utils/auth.js
// import {
//   requestLoginOtp,
//   verifyOtpAndLogin,
//   isLoggedIn,
// } from "../utils/auth";
// import "../styles/login.css"; // Pastikan path ini benar

// // Status langkah login:
// const STEP = {
//   EMAIL: "email",
//   OTP: "otp",
// };

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "", // ✅ FIX: Tambahkan field password ke state
//     otpCode: "",
//   });
//   const [step, setStep] = useState(STEP.EMAIL);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const navigate = useNavigate();
//   // ✅ FIX: Destructure password dari formData
//   const { email, password, otpCode } = formData; 

//   // Cek jika sudah login, langsung redirect ke dashboard/home
//   useEffect(() => {
//     if (isLoggedIn()) {
//       const user = JSON.parse(localStorage.getItem('user'));
//       if (user) {
//         if (user.role === "admin" || user.role === "sekda") {
//           navigate("/admin/dashboard", { replace: true });
//         } else {
//           navigate("/", { replace: true });
//         }
//       }
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handler untuk Langkah 1: Meminta OTP
//   const handleLoginStep1 = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMessage("");

//     // ✅ FIX VALIDASI: Cek email dan password
//     if (!email || !password) { 
//       setError("Email dan Password tidak boleh kosong.");
//       return;
//     }

//     setLoading(true);

//     // ✅ FIX CONTRACT: Panggil API untuk meminta OTP (mengirim email & password)
//     const result = await requestLoginOtp(email, password); 

//     setLoading(false);

//     if (result.success) {
//       setSuccessMessage("OTP telah dikirim ke email Anda.");
//       setStep(STEP.OTP);
//     } else {
//       setError(result.message);
//     }
//   };

//   // Handler untuk Langkah 2: Mengirim OTP untuk login
//   const handleLoginStep2 = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMessage("");

//     if (!otpCode) {
//       setError("Kode OTP tidak boleh kosong.");
//       return;
//     }

//     setLoading(true);

//     // Panggil API untuk memverifikasi OTP dan membuat sesi
//     const result = await verifyOtpAndLogin(email, otpCode);

//     setLoading(false);

//     if (result.success) {
//       // Login berhasil
//       const user = result.user;
      
//       // LOGIKA REDIRECT YANG SUDAH DISESUAIKAN:
//       // Admin/Sekda diarahkan ke dashboard
//       if (user.role === "admin" || user.role === "sekda") {
//         navigate("/admin/dashboard");
//       // User biasa diarahkan ke Beranda
//       } else if (user.role === "user") {
//         navigate("/"); 
//       } else {
//         // Fallback jika role tidak teridentifikasi
//         navigate("/"); 
//       }
//     } else {
//       setError(result.message);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h1 className="login-title">Login Akun</h1>

//         {/* Notifikasi Error & Success */}
//         {error && <div className="error-message">{error}</div>}
//         {successMessage && <div className="success-message">{successMessage}</div>}

//         {/* --- Form Langkah 1: Input Email & Password --- */}
//         {step === STEP.EMAIL && (
//           <form onSubmit={handleLoginStep1}>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={handleChange}
//                 placeholder="Masukkan email terdaftar Anda"
//                 required
//                 disabled={loading}
//               />
//             </div>
            
//             {/* ✅ FIX TAMPILAN: Tambahkan Input Password */}
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={handleChange}
//                 placeholder="Masukkan password Anda"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             {/* Akhir Input Password */}

//             <button type="submit" className="login-btn-2" disabled={loading}>
//               {loading ? "Memuat..." : "Minta Kode OTP"}
//             </button>
//           </form>
//         )}

//         {/* --- Form Langkah 2: Input OTP --- */}
//         {step === STEP.OTP && (
//           <form onSubmit={handleLoginStep2}>
//             <p className="otp-info">
//                 Kode OTP 6 digit telah dikirim ke **{email}**.
//                 <Link 
//                     to="#" 
//                     onClick={(e) => {
//                         e.preventDefault();
//                         setStep(STEP.EMAIL);
//                         setError("");
//                         setSuccessMessage("");
//                         setFormData({ ...formData, otpCode: "" });
//                     }}
//                     style={{ marginLeft: '5px' }}
//                 >
//                     Ganti Email
//                 </Link>
//             </p>
//             <div className="form-group">
//               <label htmlFor="otpCode">Kode OTP</label>
//               <input
//                 type="text"
//                 id="otpCode"
//                 name="otpCode"
//                 value={otpCode}
//                 onChange={handleChange}
//                 placeholder="Masukkan kode OTP"
//                 maxLength="6"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <button type="submit" className="login-btn-2" disabled={loading}>
//               {loading ? "Memuat..." : "Verifikasi & Login"}
//             </button>
//           </form>
//         )}

//         <p className="register-link">
//           Belum punya akun? <Link to="/daftar">Daftar sekarang</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// Pastikan Anda mengimpor fungsi autentikasi dari utils/auth.js
import {
  requestLoginOtp,
  verifyOtpAndLogin,
  isLoggedIn,
} from "../utils/auth";
import "../styles/login.css"; 

// Status langkah login:
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

  // Cek jika sudah login, langsung redirect ke dashboard/home
  useEffect(() => {
    if (isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        if (user.role === "admin" || user.role === "sekda") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "user") {
          // Navigasi ke dashboard user yang baru
          navigate("/user/dashboard", { replace: true }); 
        } else {
          // Fallback
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

  // Handler untuk Langkah 1: Meminta OTP
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

  // Handler untuk Langkah 2: Mengirim OTP untuk login
  const handleLoginStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otpCode) {
      setError("Kode OTP tidak boleh kosong.");
      return;
    }

    setLoading(true);

    // Panggil API untuk memverifikasi OTP dan membuat sesi
    const result = await verifyOtpAndLogin(email, otpCode);

    setLoading(false);

    if (result.success) {
      const user = result.user;
      
      // LOGIKA NAVIGASI BARU:
      if (user.role === "admin" || user.role === "sekda") {
        navigate("/admin/dashboard");
      } else if (user.role === "user") {
        // Arahkan user biasa ke dashboard mereka
        navigate("/user/dashboard"); 
      } else {
        // Fallback
        navigate("/"); 
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login Akun</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* --- Form Langkah 1: Input Email & Password --- */}
        {step === STEP.EMAIL && (
          <form onSubmit={handleLoginStep1}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Masukkan email terdaftar Anda"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
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
            </div>

            <button type="submit" className="login-btn-2" disabled={loading}>
              {loading ? "Memuat..." : "Minta Kode OTP"}
            </button>
          </form>
        )}

        {/* --- Form Langkah 2: Input OTP --- */}
        {step === STEP.OTP && (
          <form onSubmit={handleLoginStep2}>
            <p className="otp-info">
                Kode OTP 6 digit telah dikirim ke **{email}**.
                <Link 
                    to="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setStep(STEP.EMAIL);
                        setError("");
                        setSuccessMessage("");
                        setFormData({ ...formData, otpCode: "" });
                    }}
                    style={{ marginLeft: '5px' }}
                >
                    Ganti Email
                </Link>
            </p>
            <div className="form-group">
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
            </div>
            <button type="submit" className="login-btn-2" disabled={loading}>
              {loading ? "Memuat..." : "Verifikasi & Login"}
            </button>
          </form>
        )}

        <p className="register-link">
          Belum punya akun? <Link to="/daftar">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
