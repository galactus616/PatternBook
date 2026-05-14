import axios from "../../lib/axios";

// Update profile
export const updateProfile = async (data) => {
  const res = await axios.patch("/users/me", data);
  return res.data;
};

// Get payment history
export const getPaymentHistory = async () => {
  const res = await axios.get("/payments/history");
  return res.data;
};

// Export user data
export const exportData = async () => {
  const res = await axios.post("/users/me/export-data");
  return res.data;
};

// Reset all progress
export const resetProgress = async () => {
  const res = await axios.post("/users/me/reset-progress");
  return res.data;
};

// Delete account
export const deleteAccount = async () => {
  const res = await axios.delete("/users/me");
  return res.data;
};