import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

//sqlite пакет (обертка) экспортирует open, но требует sqlite3 как драйвер
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

/**
 * Opens (or returns existing) DB connection and runs migrations.
 */
export async function getDB() {
  if (db) return db;
  db = await open({
    filename: path.join(__dirname, "../data.db"),
    driver: sqlite3.Database,
  });

  // Enable foreing keys
  await db.exec("PRAGMA foreign_keys = ON;");

  // Migrations
  await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'todo',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
    `);
  return db;
}
