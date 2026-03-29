import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// This will allow us to set token once and automatically send it with all request
export function setToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export const Auth = {
  signup: (email, password) =>
    api.post("/auth/signup", { email, password }).then((res) => res.data),
  signin: (email, password) =>
    api.post("/auth/signin", { email, password }).then((res) => res.data),
};

export const Tasks = {
  list: () => api.get("/tasks").then((res) => res.data),
  create: (title) => api.post("/tasks", { title }).then((res) => res.data),
  update: (id, data) => api.patch(`/tasks/${id}`, data).then((res) => res.data),

  remove: (id) => api.delete(`/tasks/${id}`),
};

export default api;
