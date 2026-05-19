import axios from "../../lib/axios";

export const getLeaderboardData = async () => {
  const res = await axios.get("/leaderboard");
  return res.data.data;
};
