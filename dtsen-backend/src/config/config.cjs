require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1121passw0rd1121",
    database: process.env.DB_NAME || "dtsen_monolitik",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: console.log, // bisa diubah ke false kalau mau tanpa log SQL
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1121passw0rd1121",
    database: process.env.DB_NAME || "dtsen_monolitik_test",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
};
