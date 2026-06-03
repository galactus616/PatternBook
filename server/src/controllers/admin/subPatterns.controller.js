import * as subPatternsService from '../../services/admin/subPatterns.service.js';

export const getSubPatterns = async (req, res) => {
    try {
        const subPatterns = await subPatternsService.getSubPatterns();
        res.json({ success: true, subPatterns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createSubPattern = async (req, res) => {
    try {
        const subPattern = await subPatternsService.createSubPattern(req.body);
        res.status(201).json({ success: true, subPattern });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateSubPattern = async (req, res) => {
    try {
        const subPattern = await subPatternsService.updateSubPattern(req.params.id, req.body);
        res.json({ success: true, subPattern });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSubPattern = async (req, res) => {
    try {
        await subPatternsService.deleteSubPattern(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
