import axios from "../../lib/axios";

export const getFriends = async () => {
  const res = await axios.get("/friends");
  return res.data.data;
};

export const getPendingRequests = async () => {
  const res = await axios.get("/friends/pending");
  return res.data.data;
};

export const searchUsers = async (query) => {
  const res = await axios.get(`/friends/search?q=${query}`);
  return res.data.data;
};

export const sendFriendRequest = async (receiverIdentifier) => {
  const res = await axios.post("/friends/request", { receiverIdentifier });
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axios.post("/friends/accept", { requestId });
  return res.data;
};

export const removeFriendship = async (requestId) => {
  const res = await axios.delete(`/friends/${requestId}`);
  return res.data;
};
