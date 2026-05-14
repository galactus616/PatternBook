import * as userService from "../services/user.service.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = req.body;
    
    const updatedUser = await userService.updateProfile(userId, data);
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const exportData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await userService.exportData(userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const resetProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    await userService.resetProgress(userId);
    res.json({ success: true, message: "Progress reset successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    await userService.deleteAccount(userId);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
