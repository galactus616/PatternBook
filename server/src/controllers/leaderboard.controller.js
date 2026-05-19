import * as leaderboardService from "../services/leaderboard.service.js";

export const getLeaderboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await leaderboardService.getLeaderboardData(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
};
