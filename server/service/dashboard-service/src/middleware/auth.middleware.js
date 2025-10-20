import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    // simpan data user di req.user untuk digunakan di controller
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
