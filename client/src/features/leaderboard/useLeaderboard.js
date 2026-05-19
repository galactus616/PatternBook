import { useQuery } from "@tanstack/react-query";
import { getLeaderboardData } from "./leaderboard.api";

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboardData,
  });
};
