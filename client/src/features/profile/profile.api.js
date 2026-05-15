import axios from "../../lib/axios";

export const fetchPublicProfile = async (userId) => {
  const res = await axios.get(`/profile/${userId}`);
  return res.data;
};
