import {
  upsertProgress,
  fetchUserProgress,
} from "../services/progress.service.js";

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
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