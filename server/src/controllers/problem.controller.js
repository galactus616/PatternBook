import { getAllProblems } from "../services/problem.service.js";

export const getProblems = async (req, res) => {
    try {
        const filters = req.query;

        console.time("getAllProblems");

        const problems = await getAllProblems(req.query);

        console.timeEnd("getAllProblems");

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