import axios from "axios";

export const fetchProgress = async (userId) => {
    const res = await axios.get("http://localhost:5000/v1/progress", {
        params: { userId },
    });

    return res.data.data;
};

export const updateProgress = async (data) => {
    const res = await axios.post("http://localhost:5000/v1/progress", data);

    return res.data.data;
};