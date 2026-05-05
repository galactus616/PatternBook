import {
  upsertProgress,
  fetchUserProgress,
} from "../services/progress.service.js";

// 🔥 UPDATE PROGRESS
export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from JWT
    const { problemId, status, notes, attempts } = req.body;

    const result = await upsertProgress({
      userId,
      problemId,
      status,
      notes,
      attempts,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 🔥 GET PROGRESS
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await fetchUserProgress(userId);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};