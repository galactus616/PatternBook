import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "./dashboard.api";

export const useDashboard = (year) => {
  return useQuery({
    queryKey: ["dashboard-stats", year],
    queryFn: () => fetchDashboardStats(year),
    select: (res) => res.data,
  });
};
