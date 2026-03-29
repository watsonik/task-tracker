import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDB } from "../db.js";
import { signToken } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Invalid email or password too short" });
    }

    const db = await getDB();

    // Check if user exists

    const existing = await db.get(
      "SELECT id FROM users WHERE email = ?",
      email,
    );
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = await db.run(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      email,
      hash,
    );

    const id = result.lastID;
    const token = signToken({ id, email });

    return res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/signin
router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await getDB();
    const user = await db.get(
      "SELECT id, password_hash FROM users WHERE email = ?",
      email,
    );
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id, email });
    return res.json({ token });
  } catch (e) {
    next(e);
  }
});

export default router;
