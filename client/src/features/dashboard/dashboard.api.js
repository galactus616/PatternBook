import axios from "../../lib/axios";

export const fetchDashboardStats = async () => {
  const res = await axios.get("/dashboard/stats");
  return res.data;
};
