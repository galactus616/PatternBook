import * as statsService from '../../services/admin/stats.service.js';

export const getStats = async (req, res) => {
    try {
        const stats = await statsService.getStatsData();
        res.json({ success: true, ...stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
