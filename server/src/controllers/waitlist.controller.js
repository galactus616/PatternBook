import * as waitlistService from "../services/waitlist.service.js";

export const joinWaitlist = async (req, res) => {
  try {
    const { email, type, message } = req.body;
    if (!email) throw new Error("Email is required");

    const entry = await waitlistService.joinWaitlist({ email, type, message });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
