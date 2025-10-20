// import { Request, RequestAttachment, RequestLog } from "../models/index.js";

// /**
//  * =====================================
//  * 🧩 SERVICE LAYER — REQUEST MANAGEMENT
//  * =====================================
//  * Semua operasi basis data terkait Request,
//  * Attachment, dan Log dikelola di sini.
//  */

// /**
//  * 📝 Membuat pengajuan baru
//  * @param {Object} data - Data pengajuan (opd_id, title, description)
//  */
// export const createRequest = async (data) => {
//   try {
//     const request = await Request.create(data);
//     console.log("✅ Request created:", request.id);
//     return request;
//   } catch (error) {
//     console.error("❌ Error creating request:", error);
//     throw new Error("Gagal membuat pengajuan baru");
//   }
// };

// /**
//  * 📦 Mengambil semua request beserta attachment & log
//  */
// export const getAllRequests = async () => {
//   try {
//     const requests = await Request.findAll({
//       include: [
//         { model: RequestAttachment, as: "attachments" },
//         { model: RequestLog, as: "logs" },
//       ],
//       order: [["submission_date", "DESC"]],
//     });
//     console.log(`📋 Found ${requests.length} requests`);
//     return requests;
//   } catch (error) {
//     console.error("❌ Error fetching requests:", error);
//     throw new Error("Gagal mengambil data pengajuan");
//   }
// };

// /**
//  * 📎 Menambahkan lampiran ke pengajuan
//  * @param {Object} data - Data attachment (request_id, uploaded_by, file_type, file_path)
//  */
// export const addAttachment = async (data) => {
//   try {
//     const attachment = await RequestAttachment.create(data);
//     console.log("📎 Attachment added:", attachment.id);
//     return attachment;
//   } catch (error) {
//     console.error("❌ Error adding attachment:", error);
//     throw new Error("Gagal menambahkan lampiran");
//   }
// };

// /**
//  * 🧾 Menambahkan log aktivitas ke pengajuan
//  * @param {Object} data - Data log (request_id, actor_id, role, from_status, to_status, notes)
//  */
// export const addLog = async (data) => {
//   try {
//     const log = await RequestLog.create(data);
//     console.log("🧾 Log added:", log.id);
//     return log;
//   } catch (error) {
//     console.error("❌ Error adding log:", error);
//     throw new Error("Gagal menambahkan log aktivitas");
//   }
// };
