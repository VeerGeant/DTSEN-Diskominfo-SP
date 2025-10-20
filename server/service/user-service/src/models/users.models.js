export const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100),
  jabatan VARCHAR(100),
  instansi VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'perangkat_daerah',       -- default role OPD
  status VARCHAR(50) DEFAULT 'pending', -- default status pending
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;