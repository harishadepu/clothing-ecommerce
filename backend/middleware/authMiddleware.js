import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Check cookie first
    let token = req.cookies?.token;

    // If no cookie, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};