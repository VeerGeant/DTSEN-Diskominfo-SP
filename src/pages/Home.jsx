// src/pages/Home.jsx

export default function Home() {
  return (
    <div className="container">
      

      <main className="main">
        <div className="content">
          <div className="text-section">
            <h1>Data Tunggal Sosial dan Ekonomi</h1>
            <button className="cta-btn">Ajukan Permohonan Data</button>
          </div>

          <div className="image-section">
            <div className="image-wrapper">
              <div className="image-box">
                {/* KODE SVG ASLI DIHAPUS UNTUK MENGHILANGKAN ERROR SYNTAX */}
                <span 
                    className="icon" 
                    style={{ fontSize: '4rem', color: '#005ea5', margin: '0 auto 1rem', display: 'block' }}
                >
                    📊
                </span> 
                <p>Gambar Ilustrasi Data</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}