import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token = null;

    // 1) Check HttpOnly cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2) Check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // 3) Verify token
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

      // Optionally expose token for refresh
      req.token = token;

      next();
    });
  } catch (error) {
    // Should not happen unless something unexpected occurs
    return res.status(500).json({ error: "Auth middleware error" });
  }
};
