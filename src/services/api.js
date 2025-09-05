// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// --- User APIs ---
export const fetchUsers = async (page = 1, limit = 100, status = undefined) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const res = await api.get(`/account/get-all?${params.toString()}`);
  return res.data;
};

export const updateUserStatus = async (userId, status) => {
  const res = await api.patch(`/account/update-status/${userId}`, { status });
  return res.data;
};

// --- Portfolio APIs ---
export const fetchPortfolios = async (page = 1, limit = 100) => {
  const res = await api.get(`/portfolio/get-all?page=${page}&limit=${limit}`);
  return res.data;
};

// ✅ Get single portfolio by ID
export const fetchPortfolioById = async (id) => {
  const res = await api.get(`/portfolio/get-by-id/${id}`);
  return res.data;
};

export const updatePortfolioStatus = async (portfolioId, status) => {
  const res = await api.patch(`/portfolio/update-status/${portfolioId}`, {
    status,
  });
  return res.data;
};

// -----Admin Login ------------
export const adminLogin = async (email, password) => {
  const res = await api.post("/admin/login", { email, password });
  return res.data;
};

export const adminForgotPassword = async (email) => {
  const res = await api.post("/admin/forget-password", { email });
  return res.data;
};

const adminApi = axios.create({
  baseURL: "/api/admin", // your admin API base URL
});

// Add a request interceptor to automatically include the token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token && token !== "authenticated") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: call protected admin API
export const getAdminProfile = async () => {
  const res = await adminApi.get("/me");
  return res.data;
};

export const adminResetPassword = async (newPassword, confirmPassword) => {
  const res = await adminApi.patch("/reset-password",
    { newPassword, confirmPassword },
  );
  return res.data;
};

export default api;
