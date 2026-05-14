import axios from "../../lib/axios";

export const fetchProblems = async (filters) => {
  const params = new URLSearchParams();
  if (filters.topic) params.append("topic", filters.topic);
  if (filters.difficulty) params.append("difficulty", filters.difficulty);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.pattern) params.append("pattern", filters.pattern);

  const res = await axios.get(`/problems`, { 
    params
  });
  return res.data;
};

export const fetchTopics = async () => {
  const res = await axios.get(`/topics`);
  return res.data;
};

export const updateProblemProgress = async ({ problemId, status, notes }) => {
  const res = await axios.post(`/progress`, { problemId, status, notes });
  return res.data;
};
