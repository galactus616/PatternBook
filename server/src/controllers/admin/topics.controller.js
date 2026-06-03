import * as topicsService from '../../services/admin/topics.service.js';

export const getTopics = async (req, res) => {
    try {
        const topics = await topicsService.getTopics();
        res.json({ success: true, topics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTopic = async (req, res) => {
    try {
        const topic = await topicsService.createTopic(req.body);
        res.status(201).json({ success: true, topic });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateTopic = async (req, res) => {
    try {
        const topic = await topicsService.updateTopic(req.params.id, req.body);
        res.json({ success: true, topic });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteTopic = async (req, res) => {
    try {
        await topicsService.deleteTopic(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
