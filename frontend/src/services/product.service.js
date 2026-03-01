import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllProductsService = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.brand)    params.append("brand",    filters.brand);
  if (filters.search)   params.append("search",   filters.search);
  if (filters.sort)     params.append("sort",      filters.sort);
  if (filters.limit)    params.append("limit",     filters.limit);
  if (filters.page)     params.append("page",      filters.page);

  const { data } = await api.get(`/products?${params.toString()}`);
  return data;
};

export const getProductByIdService = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProductService = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProductService = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProductService = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};