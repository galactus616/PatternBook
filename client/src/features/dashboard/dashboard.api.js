import axios from "axios";

const API_URL = "http://localhost:5000/v1";

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchDashboardStats = async () => {
  const res = await axios.get(`${API_URL}/dashboard/stats`, {
    headers: getAuthHeader()
  });
  return res.data;
};
