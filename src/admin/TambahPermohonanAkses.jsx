import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // Import API Client

// --- Helper Functions ---

// Konversi nama format file panjang ke ENUM singkat untuk backend
const formatToEnum = (format) => {
  if (format.includes("CSV")) return "csv";
  if (format.includes("HTML5")) return "html5";
  if (format.includes("XML")) return "xml";
  if (format.includes("ANSI")) return "ansi";
  if (format.includes("YAML")) return "yaml";
  return "json"; // Default
};

// --- Komponen Utama ---

export default function TambahPermohonanAkses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dokumen");
  const [formData, setFormData] = useState({
    nomorSurat: "",
    nomorPenetapan: "",
    // Simpan File objects untuk referensi upload
    formulir: null,
    suratKeamanan: null,
    kak: null,
    penetapan: null,
    pendukung: null,
  });
  const [temaDipilih, setTemaDipilih] = useState("");
  // Struktur permintaan data yang lebih kompleks untuk API
  const [requestedDatasets, setRequestedDatasets] = useState([]); 
  const [formatFile, setFormatFile] = useState(""); // Format file global
  const [selectedTema, setSelectedTema] = useState(null);
  // Simpan variabel yang dipilih dalam bentuk map: { tema_nama: [var1, var2, ...] }
  const [selectedVariables, setSelectedVariables] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const temaOptions = [
    "Set Data Keluarga",
    "Set Data Anggota Keluarga (Individu)",
  ];

  const formatOptions = [
    "CSV (Comma-Separated Values)",
    "HTML5",
    "Extensible Markup Language (XML)",
    "American National Standard Institute (ANSI)",
    "Yet Another Markup Language (YAML)",
  ];

  const dokumenList = [
    { key: "formulir", label: "Formulir Permintaan DTSEN", jenis: "formulir_permohonan" },
    { key: "suratKeamanan", label: "Surat Pernyataan Keamanan dan Pemanfaatan Data", jenis: "surat_pernyataan" },
    { key: "kak", label: "Kerangka Acuan Kerja (KAK)", jenis: "kak" },
    { key: "penetapan", label: "Penetapan Kelembagaan Pelaksana Pengelolaan dan Pemanfaatan DTSEN", jenis: "penetapan_kelembagaan" },
    { key: "pendukung", label: "Dokumen Pendukung Lainnya", jenis: "dokumen_pendukung" },
  ];

  const variableDataList = [
    "Provinsi", "Kabupaten/Kota", "Kecamatan", "Desa/Kelurahan",
    "Tahun Pendataan", "Desil", "Persentil", "Alamat", "Nama Kepala Keluarga",
    "NIK Keluarga", "NIK (Kepala Keluarga) Padan", "Kualitas Dinding", "Jenis Lantai",
    "Kualitas Lantai", "Bahan Bakar Memasak", "Sumber Penerangan", "Daya Listrik Terpasang",
    "Sumber Air Minum", "Memiliki Fasilitas Buang Air Besar", "Resiko Stunting",
    "Penerima BPNT", "Penerima BST",
  ];
  
  // Stages standar yang akan dikirim ke backend
  const defaultStages = [
    // Status awal request di backend di-set 'menyiapkan_dokumen' atau 'dikirim'
    // Kita set stage pertama (verifikasi teknis) ke menunggu
    { tahap: "dikirim", status: "selesai", keterangan: "Permohonan telah diajukan dan dikirim ke sistem." },
    { tahap: "verifikasi_teknis", status: "menunggu", keterangan: "Menunggu verifikasi kelengkapan dokumen teknis." },
    { tahap: "verifikasi_substansi", status: "menunggu", keterangan: "Menunggu verifikasi kesesuaian substansi permohonan." },
    { tahap: "koordinator", status: "menunggu", keterangan: "Menunggu persetujuan Koordinator/SEKDA." },
    { tahap: "pengolahan_data", status: "menunggu", keterangan: "Menunggu proses pengolahan data oleh DISKOMINFO." },
    { tahap: "cek_kualitas", status: "menunggu", keterangan: "Menunggu pengecekan kualitas data." },
    { tahap: "unduh_data", status: "menunggu", keterangan: "Menunggu tautan data tersedia." },
    { tahap: "bast", status: "menunggu", keterangan: "Menunggu Berita Acara Serah Terima (BAST)." },
    { tahap: "selesai", status: "menunggu", keterangan: "Proses permohonan telah selesai." },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError(""); // Clear error on change

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddTema = () => {
    if (temaDipilih && !requestedDatasets.some((item) => item.tema_data === temaDipilih)) {
      setRequestedDatasets([...requestedDatasets, { tema_data: temaDipilih }]);
      setSelectedVariables({ ...selectedVariables, [temaDipilih]: [] }); // Inisialisasi variabel kosong
      setTemaDipilih("");
    }
  };

  const handleHapusTema = (nama) => {
    setRequestedDatasets(requestedDatasets.filter((item) => item.tema_data !== nama));
    const newVars = { ...selectedVariables };
    delete newVars[nama];
    setSelectedVariables(newVars);

    if (selectedTema === nama) setSelectedTema(null);
  };

  const handleLihatVariabel = (nama) => {
    setSelectedTema(nama);
  };

  const handleToggleVariable = (nama) => {
    if (!selectedTema) return;

    setSelectedVariables((prev) => {
      const currentVars = prev[selectedTema] || [];
      return {
        ...prev,
        [selectedTema]: currentVars.includes(nama)
          ? currentVars.filter((v) => v !== nama)
          : [...currentVars, nama],
      };
    });
  };

  // --- FUNGSI SUBMIT UTAMA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // 1. Validasi Dasar
    if (!formData.nomorSurat) {
      setError("Nomor Surat Permohonan wajib diisi.");
      setLoading(false);
      return;
    }
    if (requestedDatasets.length === 0 || !formatFile) {
        setError("Harap tambahkan minimal satu tema data dan pilih format file.");
        setLoading(false);
        return;
    }

    // 2. Siapkan Payload Documents
    const documentsPayload = dokumenList
      .map((doc) => {
        const file = formData[doc.key];
        if (file) {
          // Hanya dokumen penetapan yang memiliki keterangan nomor penetapan
          const keterangan = doc.key === "penetapan" ? formData.nomorPenetapan : undefined;
          
          return {
            jenis_dokumen: doc.jenis,
            nama_dokumen: file.name,
            file_url: `http://mock.url/dtsen/${doc.jenis}/${Date.now()}.${file.name.split('.').pop()}`, // Mock URL
            file_type: file.type,
            keterangan: keterangan,
            // uploaded_by akan diambil dari token di backend
          };
        }
        return null;
      })
      .filter(doc => doc !== null);
      
    // 3. Siapkan Payload Datasets
    const datasetsPayload = requestedDatasets.map(dataset => ({
        tema_data: dataset.tema_data,
        format_file: formatToEnum(formatFile), // Gunakan format global
        variables: selectedVariables[dataset.tema_data] || [], // Ambil variabel dari state
    }));

    // 4. Final Payload
    const finalPayload = {
      nomor_permohonan: formData.nomorSurat,
      nama_instansi: "Instansi Placeholder", // Ganti dengan data user yang login (belum diimplementasi)
      unit_kerja: "Unit Kerja Placeholder",
      tema_data: requestedDatasets.map(d => d.tema_data).join(', '), // Gabungkan tema untuk kolom utama
      tanggal_pengajuan: new Date().toISOString().slice(0, 10), // Tanggal hari ini
      total_hari_kerja: 0, // Nilai awal
      
      // Data nested
      documents: documentsPayload,
      datasets: datasetsPayload,
      stages: defaultStages,
    };
    
    // 5. Kirim ke API
    try {
      const response = await apiClient.post("/request/requests", finalPayload);
      setSuccess(response.data.message || "Permohonan berhasil dibuat!");
      
      // Redirect ke daftar permohonan setelah sukses
      setTimeout(() => {
        navigate("/admin/permohonan-akses");
      }, 2000);

    } catch (err) {
      console.error("Submission error:", err.response || err);
      // Tangani error unique constraint (nomor_permohonan) dari backend
      const errMsg = err.response?.data?.message || "Gagal membuat permohonan. Cek log konsol.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };


  const handleLihatDokumen = (key) => {
    const file = formData[key];
    if (file) {
      // Menggunakan URL.createObjectURL untuk menampilkan file yang diupload (hanya di browser)
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } else {
      alert("Belum ada dokumen yang diunggah!");
    }
  };

  // Tentukan variabel yang akan ditampilkan di panel kanan
  const variablesToShow = selectedTema ? selectedVariables[selectedTema] || [] : [];
  
  return (
    <div className="permohonan-baru-container">
      <h2>Permohonan Akses Data</h2>
      <div className="form-section">
        <h3>FORM PERMOHONAN AKSES DATA BARU</h3>
        <p>Lengkapi data di bawah ini untuk memulai permohonan akses data</p>

        <form onSubmit={handleSubmit}>
          <label><strong>NOMOR SURAT PERMOHONAN*:</strong></label>
          <input
            type="text"
            name="nomorSurat"
            placeholder="-- nomor surat permohonan --"
            value={formData.nomorSurat}
            onChange={handleChange}
            required
          />
          <small>Sesuai dengan nomor surat permohonan yang diajukan</small>
          
          {error && <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          {success && <p className="success-text" style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}


          {/* Tab navigation */}
          <div className="tab-container">
            <button
              type="button"
              className={`tab ${activeTab === "dokumen" ? "active" : ""}`}
              onClick={() => setActiveTab("dokumen")}
            >
              UNGGAH KELENGKAPAN DOKUMEN
            </button>
            <button
              type="button"
              className={`tab ${activeTab === "variable" ? "active" : ""}`}
              onClick={() => setActiveTab("variable")}
            >
              VARIABLE DTSEN
            </button>
          </div>

          {/* Tab Dokumen */}
          {activeTab === "dokumen" && (
            <div className="upload-section">
              {dokumenList.map((doc) => (
                <div className="upload-field" key={doc.key}>
                  <label>{doc.label}: *</label>
                  <div className="upload-input">
                    <input type="file" name={doc.key} onChange={handleChange} accept=".pdf" />
                    <button
                      type="button"
                      className="btn lihatdok"
                      onClick={() => handleLihatDokumen(doc.key)}
                      disabled={!formData[doc.key]}
                    >
                      📄 Lihat Dokumen
                    </button>
                  </div>
                  {doc.key === "penetapan" && (
                    <input
                      type="text"
                      name="nomorPenetapan"
                      placeholder="Nomor Surat Penetapan"
                      value={formData.nomorPenetapan}
                      onChange={handleChange}
                      className="nomor-penetapan"
                    />
                  )}
                </div>
              ))}
              <p className="note">
                <strong>Berkas bertanda *</strong> merupakan dokumen persyaratan wajib.
                Maksimal besar berkas 1 MB dan berformat .pdf
              </p>
            </div>
          )}

          {/* Tab Variable DTSEN */}
          {activeTab === "variable" && (
            <div className="variable-layout">
              {/* LEFT: Tema dan format */}
              <div className="left-panel">
                <label>Data yang diperlukan:</label>
                <div className="add-tema">
                  <select value={temaDipilih} onChange={(e) => setTemaDipilih(e.target.value)}>
                    <option value="">-- pilih tema data --</option>
                    {temaOptions.map((tema, i) => (
                      <option key={i} value={tema}>{tema}</option>
                    ))}
                  </select>
                  <button type="button" className="btn tambah" onClick={handleAddTema}>
                    + Tambah Tema
                  </button>
                </div>

                <div className="permintaan-data">
                  <h4>Permintaan Data ({requestedDatasets.length})</h4>
                  {requestedDatasets.map((item, i) => (
                    <div key={i} className="permintaan-item">
                      {item.tema_data}
                      <div className="aksi">
                        <button
                          type="button"
                          className="btn lihat"
                          onClick={() => handleLihatVariabel(item.tema_data)}
                          style={{ borderColor: selectedTema === item.tema_data ? '#007bff' : 'transparent' }}
                        >
                          Lihat Variabel
                        </button>
                        <button
                          type="button"
                          className="btn hapus"
                          onClick={() => handleHapusTema(item.tema_data)}
                        >
                          Hapus Tema
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="format-file">
                  <label>Format File Data:</label>
                  <select value={formatFile} onChange={(e) => setFormatFile(e.target.value)} required>
                    <option value="">-- pilih format file data --</option>
                    {formatOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIGHT: Variable Data */}
              <div className="right-panel">
                <div className="data-header">
                  <div>
                    <strong>Nama Data:</strong>{" "}
                    {selectedTema ? selectedTema : "-"}
                  </div>
                  <button type="button" className="btn lihatcak" disabled={!selectedTema}>Lihat Cakupan</button>
                </div>

                <div className="variable-list">
                  <strong>Variable Data ({selectedTema ? (selectedVariables[selectedTema] || []).length : 0}):</strong>
                  <div className="checkbox-grid">
                    {variableDataList.map((nama, i) => (
                      <label key={i} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={variablesToShow.includes(nama)}
                          onChange={() => handleToggleVariable(nama)}
                          disabled={!selectedTema}
                        />
                        {nama}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tombol bawah */}
          <div className="button-row">
            <button 
              type="submit" 
              className="btn kirim"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Kirim Permohonan'}
            </button>
            <button
              type="button"
              className="btn kembali"
              onClick={() => navigate('/admin/permohonan-akses')}
            >
              ↩ Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}