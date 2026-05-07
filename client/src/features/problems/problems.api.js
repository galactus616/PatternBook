import axios from "../../lib/axios";

export const fetchProblems = async (filters) => {
  const params = new URLSearchParams();
  if (filters.topic) params.append("topic", filters.topic);

  const res = await axios.get(`/problems`, { 
    params
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
  const res = await axios.post(`/progress`, { problemId, status, notes });
  return res.data;
};
