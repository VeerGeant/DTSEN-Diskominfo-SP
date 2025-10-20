// import axios from "axios";

// export const SERVICES = {
//   USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:4001/api/users",
//   REQUEST_SERVICE_URL: process.env.REQUEST_SERVICE_URL || "http://localhost:4003/api/requests",
// };

// // Helper untuk ambil data dari user-service
// export const fetchUsers = async () => {
//   const res = await axios.get(`${SERVICES.USER_SERVICE_URL}`);
//   return res.data;
// };

// // Helper untuk ambil data dari request-service
// export const fetchRequests = async () => {
//   const res = await axios.get(`${SERVICES.REQUEST_SERVICE_URL}`);
//   return res.data;
// };
export const SERVICE_URLS = {
  USER_SERVICE: process.env.USER_SERVICE_URL || "http://localhost:4001/api",
  REQUEST_SERVICE: process.env.REQUEST_SERVICE_URL || "http://localhost:4003/api",
};