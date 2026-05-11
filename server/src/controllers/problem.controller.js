import { getAllProblems } from "../services/problem.service.js";

export const getProblems = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userPlan = req.user?.plan || "FREE";
        const problems = await getAllProblems(req.query, userId, userPlan);

        res.json({
            success: true,
            data: problems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};