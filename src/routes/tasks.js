import { Router } from "express";
import { getDB } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Все /api/tasks* требуют токен
router.use(requireAuth);

// GET /api/tasks
router.get("/", async (req, res, next) => {
  try {
    const db = await getDB();
    const rows = await db.all(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      req.user.id,
    );
    res.set("Cache-Control", "no-store");
    res.json(rows || []);
  } catch (e) {
    next(e);
  }
});

// POST /api/tasks
router.post("/", async (req, res, next) => {
  try {
    const { title, description, status } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (status && !["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const db = await getDB();
    const s = status || "todo";

    const result = await db.run(
      "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      req.user.id,
      title.trim(),
      description?.trim() || null,
      s,
    );
    const task = await db.get(
      "SELECT * FROM tasks WHERE id = ?",
      result.lastID,
    );
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/tasks/:id — частичное обновление задачи
router.patch("/:id", async (req, res, next) => {
  try {
    console.log(
      "[PATCH] url=",
      req.originalUrl,
      "params=",
      req.params,
      "body=",
      req.body,
    );
    // 1) Надёжно парсим id (после паттерна в маршруте тут всегда число)
    const id = Number.parseInt(req.params.id, 10);

    // 2) Достаём существующую задачу текущего пользователя
    const db = await getDB();
    const prev = await db.get(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      id,
      req.user.id,
    );
    if (!prev) return res.status(404).json({ error: "Not found" });

    // 3) Нормализуем вход
    const { title, description, status } = req.body || {};
    if (status && !["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const nextTitle = title !== undefined ? String(title).trim() : prev.title;
    const nextDesc = description !== undefined ? description : prev.description;
    const nextStat = status || prev.status;

    // 4) Обновление
    await db.run(
      `UPDATE tasks
         SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      nextTitle,
      nextDesc,
      nextStat,
      id,
      req.user.id,
    );

    // 5) Возвращаем ПОЛНЫЙ объект задачи (важно для UI)
    const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);

    res.set("Cache-Control", "no-store");
    return res.json(updated);
  } catch (e) {
    console.error("[PATCH error]", e);
    next(e);
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const db = await getDB();
    const result = await db.run(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      id,
      req.user.id,
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
