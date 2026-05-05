import axios from "axios";

export const fetchProblems = async (filters) => {
  const res = await axios.get("http://localhost:5000/v1/problems", {
    params: filters,
  });

  return res.data.data;
};