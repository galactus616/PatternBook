import axios from "../../lib/axios";

export const fetchDashboardStats = async (year) => {
  const res = await axios.get(`/dashboard/stats${year ? `?year=${year}` : ""}`);
  return res.data;
};
