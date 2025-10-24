import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient"; // Import API Client

export default function ManajemenUser() {
  // State data untuk tabel pengguna
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk form Tambah/Edit (dipertahankan sebagai mockup)
  const [formData, setFormData] = useState({ nama: "", email: "", role: "user" });
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch Users on Load (GET /api/users/all)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Endpoint memerlukan otorisasi (admin/superadmin)
      const response = await apiClient.get("/users/all");
      // Backend response: [{ id, nama, email, role, status }, ...]
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err.response || err);
      setError("Gagal memuat data pengguna. Pastikan Anda login sebagai Admin/Superadmin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Handle Status Toggle (PUT /api/admin/users/:id/status)
  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const statusLabel = newStatus === "active" ? "Non-aktifkan" : "Aktifkan";

    if (!window.confirm(`Yakin ingin ${statusLabel} pengguna ini?`)) {
        return;
    }

    try {
      // API call untuk update status
      const response = await apiClient.put(`/admin/users/${userId}/status`, {
        status: newStatus,
      });

      // Update state secara lokal dengan data terbaru dari response
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: response.data.user.status } : user
        )
      );
      alert(`Status pengguna berhasil diperbarui menjadi ${newStatus.toUpperCase()} ✅`);

    } catch (err) {
      console.error("Error updating status:", err.response || err);
      alert(`Gagal memperbarui status. ${err.response?.data?.error || ''}`);
    }
  };

  // 3. Handle Delete (Mock Deletion)
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini? Ini tidak dapat dibatalkan.")) {
      return;
    }
    
    // Melakukan Mock Deletion karena endpoint DELETE user tidak disediakan di file backend yang ada.
    setUsers(users.filter((u) => u.id !== id)); 
    alert("Pengguna berhasil dihapus (Mock Deletion).");
  };

  // --- Form Handler (Kekalkan logika lokal untuk add/edit form) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Logic Edit lokal
      setUsers(
        users.map((u) => (u.id === editingId ? { ...formData, id: editingId } : u))
      );
      setEditingId(null);
    } else {
      // Logic Add lokal
      const newUser = { ...formData, id: Date.now(), status: 'pending' }; 
      setUsers([...users, newUser]);
    }
    setFormData({ nama: "", email: "", role: "user" });
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingId(user.id);
  };
  
  // --- Tampilan Loading / Error ---
  if (loading) {
    return (
      <div className="user-management" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Manajemen User</h1>
        <p>Memuat data pengguna...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h1>Manajemen User</h1>
        <p>Error: {error}</p>
      </div>
    );
  }


  return (
    <div className="user-management">
      <h1>Manajemen User</h1>
      <p>Kelola pengguna dari setiap role instansi di sistem DTSEN. ({users.length} Total Pengguna)</p>

      <div className="form-container">
        <h3>{editingId ? "Edit User (Lokal)" : "Tambah User (Lokal)"}</h3>
        <p>Catatan: Fitur Tambah/Edit di form ini hanya mengelola data di *frontend* lokal.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          {/* Menggunakan role yang ada di user-services (user/admin/superadmin) */}
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <button type="submit">{editingId ? "Perbarui" : "Tambah"}</button>
        </form>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user.id}>
              <td>{i + 1}</td>
              <td>{user.nama}</td>
              <td>{user.email}</td>
              <td>{user.role ? user.role.toUpperCase() : '-'}</td>
              <td>
                <span style={{ 
                    color: user.status === 'active' ? 'green' : user.status === 'pending' ? 'orange' : 'red',
                    fontWeight: 'bold'
                }}>
                    {user.status ? user.status.toUpperCase() : 'N/A'}
                </span>
              </td>
              <td>
                {/* Tombol Status Toggle */}
                <button 
                    className="edit-btn" 
                    onClick={() => handleStatusToggle(user.id, user.status)}
                    style={{ backgroundColor: user.status === 'active' ? '#ff8c00' : '#28a745' }}
                >
                    {user.status === 'active' ? 'Deaktifkan' : 'Aktifkan'}
                </button>
                {/* Tombol Hapus (Mock) */}
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(user.id)}
                >
                    Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}