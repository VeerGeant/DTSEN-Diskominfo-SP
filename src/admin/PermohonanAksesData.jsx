import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // Import API Client

export default function PermohonanAksesData() {
  const navigate = useNavigate();

  // Ubah inisialisasi state dari data dummy ke array kosong
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    nomor: "",
    instansi: "",
    permintaan: "",
    pemohon: "",
    jabatan: "",
    tanggal: "",
  });

  // Fungsi untuk mengambil data dari backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Panggil endpoint admin untuk mendapatkan semua permohonan
        const response = await apiClient.get("/request/requests"); 
        
        // Memetakan data dari backend agar sesuai dengan struktur tabel frontend
          const formattedData = response.data.data.map(item => {
            
            // Logika untuk Tanggal Permohonan
            let tanggalPermohonan = 'N/A';
            const dateValue = item.created_at || item.tanggal_pengajuan; // Coba ambil dari created_at atau tanggal_pengajuan
            
            if (dateValue) {
                const dateObject = new Date(dateValue);
                
                // Pastikan Date Object valid sebelum diformat
                if (!isNaN(dateObject.getTime())) { 
                    tanggalPermohonan = dateObject.toLocaleDateString('id-ID', {
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric'
                    }).replace(/\./g, ''); 
                }
            }


            return {
                id: item.id,
                nomor: item.nomor_permohonan,
                instansi: item.user?.instansi || item.nama_instansi,
                permintaan: item.requested_datasets?.map(d => d.tema_data).join(', ') || item.tema_data || "-",
                pemohon: item.user?.nama || "N/A", 
                jabatan: item.user?.jabatan || "N/A", 
                
                // ✅ Menggunakan logic pengecekan di atas
                tanggal: tanggalPermohonan, 
            };
        });

        setData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching request data:", err.response || err);
        setError("Gagal memuat data permohonan. (Akses ditolak atau server error)");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []); // Run only once on mount


  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const filteredData = data.filter((item) =>
    // Filter berdasarkan semua kolom
    Object.keys(filters).every((key) =>
      item[key]?.toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // --- Tampilan Loading / Error ---
  if (loading) {
    return (
      <div className="permohonan-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Memuat Data Permohonan...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="permohonan-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Error: {error}</h2>
        <p>Pastikan Anda login sebagai Admin dan *backend* berjalan.</p>
      </div>
    );
  }

  // --- Tampilan Utama ---
  return (
    <div className="permohonan-container">
      <div className="header-row">
        <h2>Permohonan Akses Data</h2>
        <button
          className="new-request-btn"
          onClick={() => navigate("/admin/tambah-permohonan")}
        >
          + Permohonan Akses Data Baru
        </button>
      </div>

      <div className="table-section">
        <h3>TABEL INFORMASI PERMOHONAN AKSES DATA</h3>
        <p>Berisi informasi riwayat permohonan akses data ({filteredData.length} data ditemukan)</p>

        <table className="data-table">
          <thead>
            <tr>
              <th>NOMOR PERMOHONAN</th>
              <th>NAMA INSTANSI</th>
              <th>PERMINTAAN DATA</th>
              <th>NAMA PEMOHON</th>
              <th>JABATAN</th>
              <th>TANGGAL PERMOHONAN</th>
            </tr>
            <tr>
              {Object.keys(filters).map((key) => (
                <th key={key}>
                  <input
                    type="text"
                    placeholder={`-- filter ${key} --`}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
                filteredData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.nomor}</td>
                      <td>{row.instansi}</td>
                      <td>{row.permintaan}</td>
                      <td>{row.pemohon}</td>
                      <td>{row.jabatan}</td>
                      <td>{row.tanggal}</td>
                    </tr>
                  ))
            ) : (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data permohonan yang cocok dengan filter.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient from "../api/apiClient"; 
// import { getCurrentUser } from "../utils/auth"; 

// // Menerima prop isUserContext
// export default function PermohonanAksesData({ isUserContext = false }) { 
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const user = getCurrentUser();

//   const [filters, setFilters] = useState({
//     nomor: "",
//     instansi: "",
//     permintaan: "",
//     pemohon: "",
//     jabatan: "",
//     tanggal: "",
//   });

//   // Fungsi untuk mengambil data dari backend
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
        
//         // Safety check
//         if (!user) {
//              setLoading(false);
//              return;
//         }

//         // Endpoint "/request/requests" sudah memfilter berdasarkan role di backend:
//         // - Admin/Sekda: dapat semua data
//         // - User: hanya dapat data miliknya
//         const response = await apiClient.get("/request/requests"); 
        
//         // Memetakan data dari backend
//           const formattedData = response.data.data.map(item => {
            
//             let tanggalPermohonan = 'N/A';
//             const dateValue = item.created_at || item.tanggal_pengajuan; 
            
//             if (dateValue) {
//                 const dateObject = new Date(dateValue);
//                 if (!isNaN(dateObject.getTime())) { 
//                     tanggalPermohonan = dateObject.toLocaleDateString('id-ID', {
//                         day: '2-digit', 
//                         month: 'short', 
//                         year: 'numeric'
//                     }).replace(/\./g, ''); 
//                 }
//             }

//             return {
//                 id: item.id,
//                 nomor: item.nomor_permohonan,
//                 instansi: item.user?.instansi || item.nama_instansi,
//                 permintaan: item.requested_datasets?.map(d => d.tema_data).join(', ') || item.tema_data || "-",
//                 pemohon: item.user?.nama || "N/A", 
//                 jabatan: item.user?.jabatan || "N/A", 
//                 tanggal: tanggalPermohonan, 
//             };
//         });

//         setData(formattedData);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching request data:", err.response || err);
//         setError("Gagal memuat data permohonan. (Akses ditolak atau server error)");
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [user]); 


//   const handleFilterChange = (e, key) => {
//     setFilters({ ...filters, [key]: e.target.value });
//   };

//   const filteredData = data.filter((item) =>
//     Object.keys(filters).every((key) =>
//       item[key]?.toLowerCase().includes(filters[key].toLowerCase())
//     )
//   );

//   // --- Tampilan Loading / Error ---
//   if (loading) {
//     return (
//       <div className="permohonan-container" style={isUserContext ? {padding: '0'} : { textAlign: 'center', padding: '50px' }}>
//         <h2>Memuat Data Permohonan...</h2>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="permohonan-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
//         <h2>Error: {error}</h2>
//       </div>
//     );
//   }

//   // LOGIKA TAMPIL HEADER DAN TOMBOL HANYA DI KONTEKS ADMIN ASLI
//   const showHeader = !isUserContext;
  
//   // --- Tampilan Utama ---
//   return (
//     <div className="permohonan-container" style={isUserContext ? {padding: '0', background: 'none'} : {}}>
      
//       {/* HEADER HANYA TAMPIL DI KONTEKS ADMIN ASLI */}
//       {showHeader && (
//         <div className="header-row">
//             <h2>Permohonan Akses Data</h2>
//             <button
//               className="new-request-btn"
//               onClick={() => navigate("/admin/tambah-permohonan")}
//             >
//               + Permohonan Akses Data Baru
//             </button>
//         </div>
//       )}
      
//       <div className="table-section" style={isUserContext ? {padding: '0', border: 'none', boxShadow: 'none'} : {}}>
//         <h3>TABEL INFORMASI RIWAYAT PERMOHONAN</h3>
//         <p>Berisi informasi riwayat permohonan akses data ({filteredData.length} data ditemukan)</p>

//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>NOMOR PERMOHONAN</th>
//               <th>NAMA INSTANSI</th>
//               <th>PERMINTAAN DATA</th>
//               <th>NAMA PEMOHON</th>
//               <th>JABATAN</th>
//               <th>TANGGAL PERMOHONAN</th>
//             </tr>
//             <tr>
//               {Object.keys(filters).map((key) => (
//                 <th key={key}>
//                   <input
//                     type="text"
//                     placeholder={`-- filter ${key} --`}
//                     value={filters[key]}
//                     onChange={(e) => handleFilterChange(e, key)}
//                   />
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//                 filteredData.map((row) => (
//                     <tr key={row.id}>
//                       <td>{row.nomor}</td>
//                       <td>{row.instansi}</td>
//                       <td>{row.permintaan}</td>
//                       <td>{row.pemohon}</td>
//                       <td>{row.jabatan}</td>
//                       <td>{row.tanggal}</td>
//                     </tr>
//                   ))
//             ) : (
//                 <tr>
//                     <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data permohonan yang cocok dengan filter.</td>
//                 </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }