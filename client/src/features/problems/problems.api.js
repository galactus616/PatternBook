import axios from "axios";

const API_URL = "http://localhost:5000/v1";

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProblems = async (filters) => {
  const params = new URLSearchParams();
  if (filters.topic) params.append("topic", filters.topic);

  const res = await axios.get(`${API_URL}/problems`, { 
    params,
    headers: getAuthHeader() // ✅ Added token here
  });
  return res.data;
};

export const fetchTopics = async () => {
  // Hardcoded for now as discussed
  return {
    success: true,
    data: ["Arrays", "Strings", "Linked Lists", "Stack", "Queue", "Trees", "Graphs", "DP"]
  };
};

export const updateProblemProgress = async ({ problemId, status, notes }) => {
  const res = await axios.post(`${API_URL}/progress`, 
    { problemId, status, notes },
    { headers: getAuthHeader() }
  );
  return res.data;
};
