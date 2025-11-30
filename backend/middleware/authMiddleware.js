import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token = null;

    // ✅ Only check Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
      }

      if (!payload?.id) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      // Attach user info to request
      req.user = {
        id: payload.id,
        role: payload.role || "user",
      };

      next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Auth middleware error" });
  }
};