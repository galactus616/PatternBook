import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifications = await notificationService.getUserNotifications(userId);
        res.json({ success: true, data: notifications });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        await notificationService.markAsRead(id, userId);
        res.json({ success: true, message: "Notification marked as read" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        await notificationService.markAllAsRead(userId);
        res.json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        await notificationService.deleteNotification(id, userId);
        res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
