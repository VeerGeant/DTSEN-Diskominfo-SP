import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export const getAllUsers = async (req, res) => {
  try {
    console.log("📡 Request from admin:", req.user.email);

    const response = await axios.get(`${process.env.USER_SERVICE_URL}`);

    res.status(200).json({
      message: "✅ Users fetched successfully",
      users: response.data,
    });
  } catch (error) {
    console.error("🚨 Error fetching users from user-service:", error.message);

    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }

    res.status(500).json({ error: "Failed to fetch users" });
  }
};

