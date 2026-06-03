import * as problemsService from '../../services/admin/problems.service.js';

export const getProblems = async (req, res) => {
    try {
        const problems = await problemsService.getProblems();
        res.json({ success: true, problems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProblem = async (req, res) => {
    try {
        const problem = await problemsService.createProblem(req.body);
        res.status(201).json({ success: true, problem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const problem = await problemsService.updateProblem(req.params.id, req.body);
        res.json({ success: true, problem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        await problemsService.deleteProblem(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
