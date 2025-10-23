import React, { useState } from "react";

export default function PermohonanBaru() {
  const [activeTab, setActiveTab] = useState("dokumen");
  const [formData, setFormData] = useState({
    nomorSurat: "",
    nomorPenetapan: "",
  });
  const [temaDipilih, setTemaDipilih] = useState("");
  const [permintaanData, setPermintaanData] = useState([]);
  const [formatFile, setFormatFile] = useState("");
  const [selectedTema, setSelectedTema] = useState(null);
  const [variableData, setVariableData] = useState([]);

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
    { key: "formulir", label: "Formulir Permintaan DTSEN" },
    { key: "suratKeamanan", label: "Surat Pernyataan Keamanan dan Pemanfaatan Data" },
    { key: "kak", label: "Kerangka Acuan Kerja (KAK)" },
    { key: "penetapan", label: "Penetapan Kelembagaan Pelaksana Pengelolaan dan Pemanfaatan DTSEN" },
    { key: "pendukung", label: "Dokumen Pendukung Lainnya" },
  ];

  const variableDataList = [
    "Provinsi", "Kabupaten/Kota", "Kecamatan", "Desa/Kelurahan",
    "Tahun Pendataan", "Desil", "Persentil", "Alamat", "Nama Kepala Keluarga",
    "NIK Keluarga", "NIK (Kepala Keluarga) Padan", "Kualitas Dinding", "Jenis Lantai",
    "Kualitas Lantai", "Bahan Bakar Memasak", "Sumber Penerangan", "Daya Listrik Terpasang",
    "Sumber Air Minum", "Memiliki Fasilitas Buang Air Besar", "Resiko Stunting",
    "Penerima BPNT", "Penerima BST",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleAddTema = () => {
    if (temaDipilih && !permintaanData.some((item) => item.nama === temaDipilih)) {
      setPermintaanData([...permintaanData, { nama: temaDipilih }]);
      setTemaDipilih("");
    }
  };

  const handleHapusTema = (nama) => {
    setPermintaanData(permintaanData.filter((item) => item.nama !== nama));
    if (selectedTema === nama) setSelectedTema(null);
  };

  const handleLihatVariabel = (nama) => {
    setSelectedTema(nama);
  };

  const handleToggleVariable = (nama) => {
    setVariableData((prev) =>
      prev.includes(nama)
        ? prev.filter((v) => v !== nama)
        : [...prev, nama]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Permohonan berhasil dikirim!");
  };

  const handleLihatDokumen = (key) => {
    const file = formData[key];
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } else {
      alert("Belum ada dokumen yang diunggah!");
    }
  };

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
          />
          <small>Sesuai dengan nomor surat permohonan yang diajukan</small>

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
                    <input type="file" name={doc.key} onChange={handleChange} />
                    <button
                      type="button"
                      className="btn lihatdok"
                      onClick={() => handleLihatDokumen(doc.key)}
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
                  <h4>Permintaan Data</h4>
                  {permintaanData.map((item, i) => (
                    <div key={i} className="permintaan-item">
                      {item.nama}
                      <div className="aksi">
                        <button
                          type="button"
                          className="btn lihat"
                          onClick={() => handleLihatVariabel(item.nama)}
                        >
                          Lihat Variabel
                        </button>
                        <button
                          type="button"
                          className="btn hapus"
                          onClick={() => handleHapusTema(item.nama)}
                        >
                          Hapus Tema
                        </button>
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

              {/* RIGHT: Variable Data */}
              <div className="right-panel">
                <div className="data-header">
                  <div>
                    <strong>Nama Data:</strong>{" "}
                    {selectedTema ? selectedTema : "-"}
                  </div>
                  <button type="button" className="btn lihatcak">Lihat Cakupan</button>
                </div>

                <div className="variable-list">
                  <strong>Variable Data:</strong>
                  <div className="checkbox-grid">
                    {variableDataList.map((nama, i) => (
                      <label key={i} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={variableData.includes(nama)}
                          onChange={() => handleToggleVariable(nama)}
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
            <button type="submit" className="btn kirim">Kirim Permohonan</button>
            <button
              type="button"
              className="btn kembali"
              onClick={() => window.history.back()}
            >
              ↩ Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
