import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const registerService = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
export const verifyEmailService = async (token) => {
  const res = await api.get(`/auth/verify/${token}`);
  return res.data;
};
export const loginService = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
export const getMeService = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
export const updateMeService = async (data) => {
  const res = await api.put("/auth/me", data);
  return res.data;
};
export const getAllUsersService = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};
export default api;
