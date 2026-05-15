import { getPublicProfile } from "../services/profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.userId;
    const profile = await getPublicProfile(userId, viewerId);

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
