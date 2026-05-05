import {
    upsertProgress,
    fetchUserProgress,
} from "../services/progress.service.js";

export const updateProgress = async (req, res) => {
    try {
        const data = req.body;

        const result = await upsertProgress(data);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating progress",
        });
    }
};

export const getProgress = async (req, res) => {
    try {
        const { userId } = req.query;

        const data = await fetchUserProgress(userId);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};