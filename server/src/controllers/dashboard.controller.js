import { getDashboardStats } from "../services/dashboard.service.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid user token" });
    }
    const stats = await getDashboardStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not fetch dashboard stats"
    });
  }
};
