import * as patternsService from '../../services/admin/patterns.service.js';

export const getPatterns = async (req, res) => {
    try {
        const patterns = await patternsService.getPatterns();
        res.json({ success: true, patterns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPattern = async (req, res) => {
    try {
        const pattern = await patternsService.createPattern(req.body);
        res.status(201).json({ success: true, pattern });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePattern = async (req, res) => {
    try {
        const pattern = await patternsService.updatePattern(req.params.id, req.body);
        res.json({ success: true, pattern });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePattern = async (req, res) => {
    try {
        await patternsService.deletePattern(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
