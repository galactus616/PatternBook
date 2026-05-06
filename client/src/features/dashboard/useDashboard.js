import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "./dashboard.api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    select: (res) => res.data,
  });
};
