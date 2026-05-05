import { getAllProblems } from "../services/problem.service.js";

export const getProblems = async (req, res) => {
    try {
        const filters = req.query;

        const problems = await getAllProblems(filters);

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