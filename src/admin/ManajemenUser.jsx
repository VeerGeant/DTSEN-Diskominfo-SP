import React, { useState } from "react";

export default function ManajemenUser() {
  const [users, setUsers] = useState([
    { id: 1, nama: "Andi", email: "andi@opd.go.id", role: "opd" },
    { id: 2, nama: "Budi", email: "budi@sekda.go.id", role: "sekda" },
    { id: 3, nama: "Citra", email: "citra@diskominfo.go.id", role: "diskominfo" },
    { id: 4, nama: "Dewi", email: "dewi@bapeda.go.id", role: "bapeda" },
  ]);

  const [formData, setFormData] = useState({ nama: "", email: "", role: "opd" });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setUsers(
        users.map((u) => (u.id === editingId ? { ...formData, id: editingId } : u))
      );
      setEditingId(null);
    } else {
      const newUser = { ...formData, id: Date.now() };
      setUsers([...users, newUser]);
    }
    setFormData({ nama: "", email: "", role: "opd" });
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="user-management">
      <h1>Manajemen User</h1>
      <p>Kelola pengguna dari setiap role instansi di sistem DTSEN.</p>

      <div className="form-container">
        <h3>{editingId ? "Edit User" : "Tambah User"}</h3>
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
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="opd">OPD</option>
            <option value="sekda">SEKDA</option>
            <option value="diskominfo">DISKOMINFO</option>
            <option value="bapeda">BAPEDA</option>
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user.id}>
              <td>{i + 1}</td>
              <td>{user.nama}</td>
              <td>{user.email}</td>
              <td>{user.role.toUpperCase()}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
