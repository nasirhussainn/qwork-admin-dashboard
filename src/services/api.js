import axios from "axios";

const api = axios.create({
    baseURL: "/api",
});

// --- User APIs ---
export const fetchUsers = async (page = 1, limit = 100) => {
  const res = await api.get(`/account/get-all?page=${page}&limit=${limit}`);
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

export default api;
