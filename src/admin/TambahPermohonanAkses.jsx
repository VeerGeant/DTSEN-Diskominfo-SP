import React, { useState, useCallback } from "react";
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

// Fungsi utilitas untuk membaca File sebagai Base64
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
  });
};

// --- Komponen Utama ---

export default function TambahPermohonanAkses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dokumen");
  const [formData, setFormData] = useState({
    nomorSurat: "",
    nomorPenetapan: "",
    files: {},
    base64Data: {},
  });

  const [temaDipilih, setTemaDipilih] = useState("");
  const [requestedDatasets, setRequestedDatasets] = useState([]); 
  const [formatFile, setFormatFile] = useState("");
  const [selectedTema, setSelectedTema] = useState(null);

  /**
   * selectedVariables structure:
   * {
   *   "<tema>": ["Provinsi", "Desil", "NIK Keluarga", ...],
   *   ...
   * }
   */
  const [selectedVariables, setSelectedVariables] = useState({});

  /**
   * desilValues structure:
   * {
   *   "<tema>": "range yg ditulis user, mis. 1-2 atau 0-10",
   *   ...
   * }
   */
  const [desilValues, setDesilValues] = useState({});

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
  
  const defaultStages = [
    { tahap: "dikirim", status: "selesai", keterangan: "Permohonan telah diajukan dan dikirim ke sistem." },
    { tahap: "verifikasi_teknis", status: "menunggu", keterangan: "Menunggu verifikasi kelengkapan dokumen teknis." },
    { tahap: "verifikasi_substansi", status: "menunggu", keterangan: "Menunggu verifikasi kesesuaian substansi permohonan." },
    { tahap: "koordinator", status: "menunggu", keterangan: "Menunggu persetujuan Koordinator/SEKDA." },
    { tahap: "pengolahan_data", status: "menunggu", keterangan: "Menunggu proses pengolahan data oleh DISKOMINFO." },
    { tahap: "cek_kualitas", status: "menunggu", keterangan: "Menunggu pengecekan kualitas data." },
    { tahap: "serah_terima", status: "menunggu", keterangan: "Menunggu Berita Acara Serah Terima (BAST) / Penyerahan Data." }, 
    { tahap: "selesai", status: "menunggu", keterangan: "Proses permohonan telah selesai." },
  ];

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    setError(""); 

    if (files && files.length > 0) {
        const file = files[0];
        
        try {
            const base64String = await readFileAsBase64(file);
            
            setFormData(prev => ({
                ...prev,
                files: { ...prev.files, [name]: file },
                base64Data: { ...prev.base64Data, [name]: base64String }
            }));
            
        } catch (readError) {
            console.error("Error reading file:", readError);
            setError(`Gagal membaca file ${file.name}.`);

            setFormData(prev => ({
                ...prev,
                files: { ...prev.files, [name]: null },
                base64Data: { ...prev.base64Data, [name]: null }
            }));
        }

    } else {
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    }
  };

  const handleAddTema = () => {
    if (temaDipilih && !requestedDatasets.some((item) => item.tema_data === temaDipilih)) {
      setRequestedDatasets(prev => [...prev, { tema_data: temaDipilih }]);
      setSelectedVariables(prev => ({ ...prev, [temaDipilih]: [] })); 
      setDesilValues(prev => ({ ...prev, [temaDipilih]: "" })); // inisialisasi desil untuk tema baru
      setTemaDipilih("");
    }
  };

  const handleHapusTema = (nama) => {
    setRequestedDatasets(requestedDatasets.filter((item) => item.tema_data !== nama));
    const newVars = { ...selectedVariables };
    delete newVars[nama];
    setSelectedVariables(newVars);

    const newDesil = { ...desilValues };
    delete newDesil[nama];
    setDesilValues(newDesil);

    if (selectedTema === nama) setSelectedTema(null);
  };

  const handleLihatVariabel = (nama) => setSelectedTema(nama);

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

  const handleDesilChange = (tema, value) => {
    setDesilValues(prev => ({ ...prev, [tema]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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

    const documentsPayload = dokumenList
      .map((doc) => {
        const file = formData.files[doc.key];
        const base64 = formData.base64Data[doc.key];
        
        if (file && base64) {
          const keterangan = doc.key === "penetapan" ? formData.nomorPenetapan : undefined;
          
          return {
            jenis_dokumen: doc.jenis,
            nama_dokumen: file.name,
            file_url: null,
            file_type: file.type,
            file_data: base64,
            keterangan: keterangan,
          };
        }
        return null;
      })
      .filter(doc => doc !== null);

    // Build datasets payload: jika Desil terpilih dan user mengisi desilValues[tema],
    // kita ganti "Desil" menjadi "Desil: <nilai>" (backend menyimpan string)
    const datasetsPayload = requestedDatasets.map(dataset => {
      const tema = dataset.tema_data;
      const vars = (selectedVariables[tema] || []).slice(); // copy
      if (vars.includes("Desil")) {
        const desilVal = (desilValues[tema] || "").trim();
        // jika ada nilai, replace "Desil" dengan "Desil: <nilai>", jika kosong biarkan "Desil"
        const idx = vars.indexOf("Desil");
        if (idx !== -1) {
          vars[idx] = desilVal ? `Desil: ${desilVal}` : "Desil";
        }
      }
      return {
        tema_data: tema,
        format_file: formatToEnum(formatFile),
        variables: vars,
      };
    });

    const finalPayload = {
      nomor_permohonan: formData.nomorSurat,
      nama_instansi: "Instansi Placeholder",
      unit_kerja: "Unit Kerja Placeholder",
      tema_data: requestedDatasets.map(d => d.tema_data).join(', '), 
      tanggal_pengajuan: new Date().toISOString().slice(0, 10),
      total_hari_kerja: 0,
      documents: documentsPayload,
      datasets: datasetsPayload,
      stages: defaultStages,
    };
    
    try {
      const response = await apiClient.post("/request/requests", finalPayload);
      setSuccess(response.data.message || "Permohonan berhasil dibuat!");
      
      setTimeout(() => {
        navigate("/admin/permohonan-akses");
      }, 2000);

    } catch (err) {
      console.error("Submission error:", err.response || err);
      const errMsg = err.response?.data?.message || "Gagal membuat permohonan.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLihatDokumen = (key) => {
    const base64 = formData.base64Data[key];
    if (base64) window.open(base64, "_blank");
    else alert("Belum ada dokumen yang diunggah!");
  };

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

          {/* Tabs */}
          <div className="tab-container">
            <button type="button" className={`tab ${activeTab === "dokumen" ? "active" : ""}`} onClick={() => setActiveTab("dokumen")}>UNGGAH KELENGKAPAN DOKUMEN</button>

            <button type="button" className={`tab ${activeTab === "variable" ? "active" : ""}`} onClick={() => setActiveTab("variable")}>VARIABLE DTSEN</button>
          </div>

          {/* Tab Dokumen */}
          {activeTab === "dokumen" && (
            <div className="upload-section">
              {dokumenList.map((doc) => (
                <div className="upload-field" key={doc.key}>
                  <label>{doc.label}: *</label>
                  <div className="upload-input">
                    <input type="file" name={doc.key} onChange={handleChange} accept=".pdf" />
                    <button type="button" className="btn lihatdok" onClick={() => handleLihatDokumen(doc.key)} disabled={!formData.base64Data[doc.key]}>
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
              <p className="note"><strong>Berkas bertanda *</strong> merupakan dokumen persyaratan wajib.</p>
            </div>
          )}

          {/* Tab Variable */}
          {activeTab === "variable" && (
            <div className="variable-layout">
              <div className="left-panel">
                <label>Data yang diperlukan:</label>
                <div className="add-tema">
                  <select value={temaDipilih} onChange={(e) => setTemaDipilih(e.target.value)}>
                    <option value="">-- pilih tema data --</option>
                    {temaOptions.map((tema, i) => (
                      <option key={i} value={tema}>{tema}</option>
                    ))}
                  </select>
                  <button type="button" className="btn tambah" onClick={handleAddTema}>+ Tambah Tema</button>
                </div>

                <div className="permintaan-data">
                  <h4>Permintaan Data ({requestedDatasets.length})</h4>
                  {requestedDatasets.map((item, i) => (
                    <div key={i} className="permintaan-item">
                      {item.tema_data}
                      <div className="aksi">
                        <button type="button" className="btn lihat" onClick={() => handleLihatVariabel(item.tema_data)}>Lihat Variabel</button>
                        <button type="button" className="btn hapus" onClick={() => handleHapusTema(item.tema_data)}>Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="format-file">
                  <label>Format File Data:</label>
                  <select value={formatFile} onChange={(e) => setFormatFile(e.target.value)}>
                    <option value="">-- pilih format file data --</option>
                    {formatOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="right-panel">
                <div className="data-header">
                  <div><strong>Nama Data:</strong> {selectedTema || "-"}</div>
                  <button className="btn lihatcak" type="button" disabled={!selectedTema}>Lihat Cakupan</button>
                </div>

                <div className="variable-list">
                  <strong>Variable Data ({variablesToShow.length}):</strong>
                  <div className="checkbox-grid">
                    {variableDataList.map((nama, i) => (
                      <label key={i} className="checkbox-item">
                        <input
                          type="checkbox"
                          disabled={!selectedTema}
                          checked={variablesToShow.includes(nama)}
                          onChange={() => handleToggleVariable(nama)}
                        />
                        {nama}
                      </label>
                    ))}
                  </div>

                  {/* Jika Desil dipilih untuk tema yang sedang aktif, tampilkan input string */}
                  {selectedTema && variablesToShow.includes("Desil") && (
                    <div className="desil-input-wrapper">
                      <label><strong>Range Desil (string):</strong></label>
                      <input
                        type="text"
                        className="desil-input"
                        placeholder="Contoh: 1-2 atau 0-10 atau kuartil 1-2"
                        value={desilValues[selectedTema] || ""}
                        onChange={(e) => handleDesilChange(selectedTema, e.target.value)}
                      />
                      <small className="desil-helper">Nilai ini akan dikirim sebagai string: <code>Desil: &lt;nilai&gt;</code></small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="button-row">
            <button className="btn kirim" type="submit" disabled={loading}>{loading ? "Mengirim..." : "Kirim Permohonan"}</button>
            <button className="btn kembali" type="button" onClick={() => navigate("/admin/permohonan-akses")}>↩ Kembali</button>
          </div>

        </form>
      </div>
    </div>
  );
}
