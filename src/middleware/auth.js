import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload) {
  // expireIn - чтобы токен не жил вечно (интервьюеры часто спрашивают)
  return jwt.sign(payload, SECRET, { expiresIn: "2h" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    // decoded typically: {id, email, iat, exp}
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
