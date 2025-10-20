// src/models/request.model.js
import pool from "../config/db.js";

export const createRequest = async (data) => {
  const {
    user_id,
    nama,
    email,
    opd,
    surat_permohonan,
    kak,
    nda,
    status,
  } = data;

  const query = `
    INSERT INTO requests (user_id, nama, email, opd, surat_permohonan, kak, nda, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    user_id,
    nama,
    email,
    opd,
    surat_permohonan,
    kak,
    nda,
    status || "draft",
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
