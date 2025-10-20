import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'user_service',
});
pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(-1);
});
export default pool;
