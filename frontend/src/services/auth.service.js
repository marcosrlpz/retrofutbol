import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: añade el token a todas las peticiones automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginService = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const registerService = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const getMeService = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

// ✅ Actualizar perfil - devuelve data directamente (no data.data)
export const updateMeService = async (userData) => {
  const { data } = await api.put("/auth/me", userData);
  return data; // { message, user }
};

export const getAllUsersService = async () => {
  const { data } = await api.get("/auth/users");
  return data;
};

export const deleteUserService = async (id) => {
  const { data } = await api.delete(`/auth/users/${id}`);
  return data;
};

export default api;