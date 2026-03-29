import { useState, useEffect } from "react";
import { Auth, Tasks, setToken } from "./api";

export default function App() {
  const savedToken = localStorage.getItem("token") || "";
  const [token, setTokState] = useState(savedToken);

  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("secret123");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  console.log("React token state:", token);
  console.log("LocalStorage token:", localStorage.getItem("token"));

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(console.log)
      .catch(console.error);
  }, []);

  // Load tasks when token appears
  useEffect(() => {
    if (!token) return;
    setToken(token);
    localStorage.setItem("token", token);
    Tasks.list().then(setTasks).catch(console.error);
  }, [token]);

  const signin = async () => {
    const { token } = await Auth.signin(email, password);
    setTokState(token);
  };

  const signup = async () => {
    const { token } = await Auth.signup(email, password);
    setTokState(token);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await Tasks.create(title.trim()); // 1) создаём
    setTitle("");
    const fresh = await Tasks.list(); // 2) пересчитываем с сервера
    setTasks(Array.isArray(fresh) ? fresh : []); // 3) гарантируем массив
  };

  const toggleStatus = async (task) => {
    const next = task.status === "done" ? "todo" : "done";
    const updated = await Tasks.update(task.id, { status: next });
    setTasks((prev) =>
      Array.isArray(prev)
        ? prev.map((x) => (x.id === task.id ? updated : x))
        : [updated],
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTokState("");
    setTasks([]);
  };

  if (!token) {
    return (
      <div
        style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}
      >
        <h2>Login / Signup</h2>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button onClick={signin}>Sign in</button>
        <button onClick={signup} style={{ marginLeft: 10 }}>
          Sign up
        </button>
      </div>
    );
  }
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div
      style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h2>Tasks</h2>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button onClick={addTask}>Add</button>
        <button onClick={logout} style={{ marginLeft: 10 }}>
          Logout
        </button>
      </div>

      {/* Пустое состояние */}
      {safeTasks.length === 0 ? (
        <p style={{ color: "#666", marginTop: 16 }}>
          No tasks yet — add your first one above.
        </p>
      ) : (
        <ul style={{ marginTop: 12 }}>
          {safeTasks.map((task) => (
            <li key={task.id} style={{ marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={task.status === "done"}
                onChange={() => toggleStatus(task)}
              />
              <span
                style={{
                  marginLeft: 8,
                  textDecoration:
                    task.status === "done" ? "line-through" : "none",
                }}
              >
                {task.title}
              </span>

              <button
                onClick={async () => {
                  await Tasks.remove(task.id); // DELETE запрос
                  setTasks(tasks.filter((t) => t.id !== task.id)); // удаляем из UI
                }}
                style={{ marginLeft: 10, color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
