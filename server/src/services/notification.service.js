import { prisma } from "../db/client.js";
import { io, getReceiverSocketId } from "../socket.js";
import crypto from "crypto";

export const createNotification = async (userId, type, message, referenceId = null) => {
    try {
        const id = crypto.randomUUID();
        const notification = {
            id,
            userId,
            type,
            message,
            referenceId,
            isRead: false,
            createdAt: new Date()
        };

        const socketId = getReceiverSocketId(userId);
        if (socketId) {
            io.to(socketId).emit("newNotification", notification);
        }

        prisma.notification.create({
            data: {
                id,
                userId,
                type,
                message,
                referenceId
            }
        }).catch(err => {
            console.error("Error saving notification in background:", err);
        });

        return notification;
    } catch (err) {
        console.error("Error creating notification:", err);
        return null;
    }
};

export const getUserNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
};

export const markAsRead = async (notificationId, userId) => {
    return await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true }
    });
};

export const markAllAsRead = async (userId) => {
    return await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
};

export const deleteNotification = async (notificationId, userId) => {
    return await prisma.notification.deleteMany({
        where: { id: notificationId, userId }
    });
};
