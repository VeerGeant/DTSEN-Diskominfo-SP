import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../api/apiClient";

const getStatusClass = (status) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("selesai")) return "selesai";
  if (lowerStatus.includes("proses")) return "proses";
  return "menunggu";
};

const STATUS_OPTIONS = ["menunggu", "proses", "selesai"];

export default function VerifikasiTahapan() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = new URLSearchParams(location.search).get("requestId");

  const [requestData, setRequestData] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [tanggalDtsenDiterima, setTanggalDtsenDiterima] = useState("");
  const [datasetVersions, setDatasetVersions] = useState({});
  const [totalDataDiterima, setTotalDataDiterima] = useState({});

  // ✅ fungsi bantu format waktu agar cocok untuk <input type="datetime-local">
  const formatDatetimeLocal = (datetime) => {
    if (!datetime) return "";
    try {
      const date = new Date(datetime);
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const fetchStages = useCallback(async () => {
    if (!requestId) {
      setError("ID Permohonan tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get(`/request/requests/${requestId}`);
      const data = res.data.data;
      setRequestData(data);

      // ✅ sort & format tanggal
      const sortedStages = data.stages
        .sort((a, b) => a.id - b.id)
        .map((stage) => ({
          ...stage,
          tanggal_mulai: formatDatetimeLocal(stage.tanggal_mulai),
          tanggal_selesai: formatDatetimeLocal(stage.tanggal_selesai),
        }));
      setStages(sortedStages);

      // ✅ ambil tanggal DTSEN diterima bila ada
      const serahTerimaStage = sortedStages.find(
        (s) => s.tahap === "serah_terima"
      );
      if (serahTerimaStage?.tanggal_dtsen_diterima) {
        setTanggalDtsenDiterima(
          formatDatetimeLocal(serahTerimaStage.tanggal_dtsen_diterima)
        );
      }

      // ✅ siapkan versi dataset & total data diterima
      const initialVersions = {};
      const initialTotals = {};
      if (data.requested_datasets?.length > 0) {
        data.requested_datasets.forEach((ds) => {
          initialVersions[ds.id] = ds.dataset_version || "";
          initialTotals[ds.id] = ds.total_data_diterima || "";
        });
      }
      setDatasetVersions(initialVersions);
      setTotalDataDiterima(initialTotals);
      setError(null);
    } catch (err) {
      console.error("Error fetching stages:", err.response || err);
      setError(
        err.response?.data?.message ||
          "Gagal memuat data tahapan. Cek console untuk detail."
      );
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  // === handler ===
  const handleChangeStatus = (id, newStatus) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, status: newStatus } : stage
      )
    );
  };

  const handleChangeDeskripsi = (id, newKeterangan) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, keterangan: newKeterangan } : stage
      )
    );
  };

  const handleChangeTanggal = (id, value) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, tanggal_mulai: value } : stage
      )
    );
  };

  const handleVersionChange = (datasetId, value) => {
    setDatasetVersions((prev) => ({
      ...prev,
      [datasetId]: value,
    }));
  };

  const handleTotalDataChange = (datasetId, value) => {
    setTotalDataDiterima((prev) => ({
      ...prev,
      [datasetId]: value,
    }));
  };

  // === simpan data ===
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg("");

    try {
      let stagesUpdated = 0;
      let versionsUpdated = 0;
      let totalsUpdated = 0;

      const updateStagePromises = stages.map(async (stage) => {
        const originalStage = requestData.stages.find(
          (s) => s.id === stage.id
        );

        const isChanged =
          originalStage?.status !== stage.status ||
          originalStage?.keterangan !== stage.keterangan ||
          formatDatetimeLocal(originalStage?.tanggal_mulai) !==
            stage.tanggal_mulai ||
          originalStage?.tanggal_dtsen_diterima !== tanggalDtsenDiterima;

        if (isChanged) {
          stagesUpdated++;
          const payload = {
            status: stage.status,
            tanggal_mulai: stage.tanggal_mulai
              ? new Date(stage.tanggal_mulai).toISOString()
              : null,
            tanggal_selesai:
              stage.status === "selesai" && stage.tanggal_mulai
                ? new Date(stage.tanggal_mulai).toISOString()
                : null,
            keterangan:
              stage.keterangan ||
              `Status diubah menjadi ${stage.status.toUpperCase()}`,
          };

          if (stage.tahap === "serah_terima" && tanggalDtsenDiterima) {
            payload.tanggal_dtsen_diterima = new Date(
              tanggalDtsenDiterima
            ).toISOString();
          }

          return apiClient.put(`/request/stages/${stage.id}`, payload);
        }
      });

      const updateDatasetPromises = requestData.requested_datasets.map(
        async (ds) => {
          const newVersion = datasetVersions[ds.id];
          const newTotal = totalDataDiterima[ds.id];

          if (newVersion !== ds.dataset_version || newTotal !== ds.total_data_diterima) {
            versionsUpdated++;
            if (newTotal) totalsUpdated++;
            await apiClient.put(`/request/datasets/${ds.id}/version`, {
              dataset_version: newVersion,
              total_data_diterima: newTotal,
            });
          }
        }
      );

      await Promise.all([...updateStagePromises, ...updateDatasetPromises]);

      const lastStage = stages
        .slice()
        .reverse()
        .find((s) => s.status === "selesai" || s.status === "proses");
      if (lastStage) {
        await apiClient.put(`/request/requests/${requestId}`, {
          status: lastStage.tahap,
        });
      }

      setSuccessMsg(
        `Perubahan disimpan: ${stagesUpdated} tahapan, ${versionsUpdated} dataset versi, dan ${totalsUpdated} total data diperbarui.`
      );
      await fetchStages();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error saving changes:", err.response || err);
      setError(
        `Gagal menyimpan perubahan. ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  const semuaTahapanSelesai =
    stages.length > 0 && stages.every((s) => s.status === "selesai");

  if (loading)
    return (
      <div
        className="verifikasi-tahapan-container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        Memuat data tahapan...
      </div>
    );

  if (error || !requestData)
    return (
      <div className="verifikasi-tahapan-container">
        <p className="verifikasi-tahapan-alert error">
          {error || "Data Permohonan tidak ditemukan."}
        </p>
        <div
          className="verifikasi-tahapan-buttons"
          style={{ justifyContent: "center" }}
        >
          <button
            className="btn-kembali"
            onClick={() => navigate(`/admin/verifikasi-list`)}
          >
            ← Kembali ke Daftar
          </button>
        </div>
      </div>
    );

  return (
    <div className="verifikasi-tahapan-container">
      <h3 className="verifikasi-tahapan-title">
        Verifikasi Tahapan Dokumen: {requestData.nomor_permohonan}
      </h3>

      {error && <p className="verifikasi-tahapan-alert error">{error}</p>}
      {successMsg && (
        <p className="verifikasi-tahapan-alert success">{successMsg}</p>
      )}

      <table className="verifikasi-tahapan-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Tahapan</th>
            <th>Deskripsi</th>
            <th>Status Saat Ini</th>
            <th>Ubah Status</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.tahap.replace(/_/g, " ").toUpperCase()}</td>
              <td>
                <input
                  type="text"
                  className="verifikasi-tahapan-deskripsi"
                  value={item.keterangan || ""}
                  onChange={(e) =>
                    handleChangeDeskripsi(item.id, e.target.value)
                  }
                  disabled={saving}
                />
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(item.status)}`}>
                  {item.status.toUpperCase()}
                </span>
              </td>
              <td>
                <select
                  className="verifikasi-tahapan-select"
                  value={item.status}
                  onChange={(e) => handleChangeStatus(item.id, e.target.value)}
                  disabled={saving}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="datetime-local"
                  className="verifikasi-tahapan-deskripsi"
                  value={item.tanggal_mulai || ""}
                  onChange={(e) =>
                    handleChangeTanggal(item.id, e.target.value)
                  }
                  disabled={saving}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {semuaTahapanSelesai && (
        <>
          <div className="verifikasi-tahapan-form">
            <h4 style={{ marginTop: "20px", fontSize: "1rem", color: "#111" }}>
              Waktu DTSEN Diterima
            </h4>
            <input
              type="datetime-local"
              className="verifikasi-tahapan-deskripsi"
              value={tanggalDtsenDiterima || ""}
              onChange={(e) => setTanggalDtsenDiterima(e.target.value)}
            />
            <p
              style={{
                fontSize: "0.85rem",
                color: "#6b7280",
                marginTop: "6px",
              }}
            >
              Masukkan tanggal & waktu dokumen DTSEN diterima setelah semua
              tahapan selesai.
            </p>
          </div>

          {requestData.requested_datasets?.length > 0 && (
            <div className="verifikasi-tahapan-form">
              <h4 style={{ fontSize: "1rem", color: "#111" }}>
                Input Versi Dataset
              </h4>
              <tbody>
                {requestData.requested_datasets.map((ds) => (
                  <tr key={ds.id}>
                    <td>
                      <input
                        type="text"
                        className="verifikasi-tahapan-deskripsi"
                        placeholder="Masukkan versi dataset..."
                        value={datasetVersions[ds.id] || ""}
                        onChange={(e) =>
                          handleVersionChange(ds.id, e.target.value)
                        }
                        disabled={saving}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

              <h4 style={{ fontSize: "1rem", color: "#111", marginTop: "20px" }}>
                Input Total Data Diterima
              </h4>
              <tbody>
                {requestData.requested_datasets.map((ds) => (
                  <tr key={ds.id}>
                    <td>
                      <input
                        type="number"
                        className="verifikasi-tahapan-deskripsi"
                        placeholder="Masukkan total data diterima..."
                        value={totalDataDiterima[ds.id] || ""}
                        onChange={(e) =>
                          handleTotalDataChange(ds.id, e.target.value)
                        }
                        disabled={saving}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
          )}
        </>
      )}

      <div className="verifikasi-tahapan-buttons">
        <button
          className="btn-kembali"
          onClick={() => navigate(`/admin/list-tahapan`)}
        >
          ← Kembali ke Daftar
        </button>
        <button className="btn-simpan" disabled={saving} onClick={handleSave}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
