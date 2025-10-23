import React, { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';

const Settings = () => {
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Semua kolom harus diisi.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok.');
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user || !user.email) {
        alert('Anda belum login.');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      alert('Password berhasil diubah.');

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordPopup(false);
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/wrong-password') {
        alert('Password lama salah.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password baru terlalu lemah.');
      } else {
        alert('Gagal mengubah password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Settings Admin</h2>
      <p>Selamat datang di halaman Settings admin.</p>

      <div className="settings-section">
        <h2>Ubah Password</h2>
        <div className="button-with-text">
          <p>Ganti password Anda jika diperlukan untuk keamanan.</p>
          <button
            onClick={() => setShowPasswordPopup(true)}
            className="btn-change-password"
          >
            Ubah Password
          </button>
        </div>
      </div>

      {showPasswordPopup && (
        <div className="password-popup-overlay">
          <div className="password-popup">
            <h3>Ubah Password</h3>
            <input
              type="password"
              placeholder="Password lama"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="form-buttons">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="btn-cancel"
              >
                Batal
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="btn-save"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
