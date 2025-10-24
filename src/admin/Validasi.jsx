import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient"; 
import "./../styles/validasi.css";

// Fungsi helper untuk menentukan status badge class
const getStatusClass = (status) => {
  if (status.includes("DITERUSKAN") || status.includes("KOORDINATOR")) return "status-forward";
  if (status.includes("DITOLAK")) return "status-rejected";
  return "status-pending";
};

export default function ValidasiVerifikasi() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fungsi untuk mengambil data verifikasi
  const fetchVerifikasiRequests = async () => {
    try {
      setLoading(true);
      // Memanggil endpoint request/requests. Backend akan mengembalikan SEMUA data 
      // karena role Admin/Verifikator diizinkan (atau disaring di sini).
      const response = await apiClient.get("/request/requests"); 
      
      // Filter di Frontend: Hanya yang status tahapnya sedang "verifikasi_substansi" 
      // (asumsi ini tahap SEKDA/Koordinator) atau "verifikasi_teknis"
      const filteredAndFormatted = response.data.data
        .filter(item => ["verifikasi_teknis", "verifikasi_substansi", "koordinator"].includes(item.status)) 
        .map(item => {
            // Cari stage yang sedang 'menunggu' untuk diproses (stage aktif)
            const currentStage = item.stages.find(s => s.status === 'menunggu');

            return {
                id: item.id, // ID Request
                nomor: item.nomor_permohonan,
                nama: item.tema_data || "Permohonan Data",
                opd: item.user?.instansi || item.nama_instansi, // Ambil dari data user atau data request
                tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/\./g, ''),
                status: currentStage ? `Menunggu: ${currentStage.tahap.replace(/_/g, ' ').toUpperCase()}` : 'Tidak Diketahui',
                deskripsi: `Pengajuan dari OPD ${item.user?.instansi} untuk tema ${item.tema_data}.`,
                currentStageId: currentStage?.id, // ID dari stage yang aktif
                currentStageName: currentStage?.tahap,
                user: item.user, // Data user (pemohon)
                stages: item.stages // Semua stages
            };
        });

      setPengajuanList(filteredAndFormatted);
      setError(null);
    } catch (err) {
      console.error("Error fetching verifikasi data:", err.response || err);
      setError("Gagal memuat data verifikasi. (Akses ditolak atau server error)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifikasiRequests();
  }, []);

  // Handler untuk Validasi / Disposisi
  const handleValidasi = async () => {
    if (!selectedItem || !selectedItem.currentStageId) {
        alert("Tidak ada tahap yang menunggu untuk divalidasi.");
        return;
    }

    try {
        const currentStageId = selectedItem.currentStageId;
        const currentStageIndex = selectedItem.stages.findIndex(s => s.id === currentStageId);
        const nextStage = selectedItem.stages[currentStageIndex + 1];

        // 1. Selesaikan Stage Saat Ini (Set status ke 'selesai')
        await apiClient.put(`/request/stages/${currentStageId}`, {
            status: "selesai",
            tanggal_selesai: new Date().toISOString().slice(0, 10),
            keterangan: `Validasi tahap ${selectedItem.currentStageName.toUpperCase()} disetujui.`,
        });

        // 2. Jika ada Stage berikutnya, update status request utama dan aktifkan Stage berikutnya
        if (nextStage) {
            // Update status Request utama ke nama tahap berikutnya
            await apiClient.put(`/request/requests/${selectedItem.id}`, {
                status: nextStage.tahap, 
            });

            // Aktifkan Stage berikutnya (Set status ke 'proses')
            await apiClient.put(`/request/stages/${nextStage.id}`, {
                status: "proses",
                tanggal_mulai: new Date().toISOString().slice(0, 10),
                keterangan: `Diteruskan ke tahap ${nextStage.tahap.toUpperCase()}`,
            });
        }
        
        // Refresh data
        await fetchVerifikasiRequests();
        setSelectedItem(null);
        alert("Status diperbarui: Disposisi berhasil dan diteruskan ke tahap berikutnya. ✅");

    } catch (err) {
        console.error("Error validasi:", err.response || err);
        alert(`Gagal memproses validasi: ${err.response?.data?.error || err.message}`);
    }
  };

  // Handler untuk Tolak
  const handleTolak = async () => {
    if (!selectedItem || !selectedItem.currentStageId) return;
    const alasan = prompt("Masukkan alasan penolakan:");
    if (!alasan) return;

    try {
        const currentStageId = selectedItem.currentStageId;
        
        // 1. Update Stage saat ini ke 'selesai' dengan keterangan penolakan
        await apiClient.put(`/request/stages/${currentStageId}`, {
            status: "selesai",
            tanggal_selesai: new Date().toISOString().slice(0, 10),
            keterangan: `DITOLAK oleh SEKDA/VERIFIKATOR: ${alasan}`,
        });
        
        // 2. Update status Request utama ke 'dikirim' (untuk memulai ulang proses)
        await apiClient.put(`/request/requests/${selectedItem.id}`, {
            status: "dikirim", 
        });

        // Refresh data
        await fetchVerifikasiRequests();
        setSelectedItem(null);
        alert("Status diperbarui: Ditolak dan dikembalikan ke tahap awal. ❌");

    } catch (err) {
        console.error("Error penolakan:", err.response || err);
        alert(`Gagal memproses penolakan: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) return <div className="validasi-page" style={{ textAlign: 'center', padding: '50px' }}>Memuat data verifikasi...</div>;
  if (error) return <div className="validasi-page" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="validasi-page">
      <h2>Validasi / Verifikasi Pengajuan (SEKDA)</h2>
      <p>Berikut daftar pengajuan yang memerlukan validasi teknis/substansi/koordinator Anda. ({pengajuanList.length} total)</p>

      <table className="validasi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Permohonan</th>
            <th>OPD / Instansi</th>
            <th>Tanggal Pengajuan</th>
            <th>Status Tahap</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pengajuanList.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nomor}</td>
              <td>{item.opd}</td>
              <td>{item.tanggal}</td>
              <td>
                <span className={`status ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <button
                  className="btn-detail"
                  onClick={() => setSelectedItem(item)}
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedItem.nama}</h3>
            <p><strong>Nomor Permohonan:</strong> {selectedItem.nomor}</p>
            <p><strong>OPD / Instansi:</strong> {selectedItem.opd}</p>
            <p><strong>Pemohon:</strong> {selectedItem.user?.nama || 'N/A'}</p>
            <p><strong>Jabatan Pemohon:</strong> {selectedItem.user?.jabatan || 'N/A'}</p>
            <p><strong>Tanggal Pengajuan:</strong> {selectedItem.tanggal}</p>
            <p><strong>Tahap Menunggu:</strong> {selectedItem.status}</p>

            <div className="modal-actions">
              <button
                className="btn-validasi"
                onClick={handleValidasi}
              >
                Validasi & Disposisi
              </button>

              <button
                className="btn-tolak"
                onClick={handleTolak}
              >
                Tolak
              </button>

              <button
                className="btn-batal"
                onClick={() => setSelectedItem(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}