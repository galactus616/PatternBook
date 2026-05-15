import * as friendService from "../services/friend.service.js";

export const sendRequest = async (req, res) => {
    try {
        const { receiverIdentifier } = req.body;
        const senderId = req.user.userId;
        const result = await friendService.sendFriendRequest(senderId, receiverIdentifier);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user.userId;
        const result = await friendService.acceptFriendRequest(userId, requestId);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const removeFriendship = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.userId;
        await friendService.removeFriendship(userId, requestId);
        res.json({ success: true, message: "Friendship removed" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.user.userId;
        const friends = await friendService.getFriends(userId);
        res.json({ success: true, data: friends });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getPending = async (req, res) => {
    try {
        const userId = req.user.userId;
        const pending = await friendService.getPendingRequests(userId);
        res.json({ success: true, data: pending });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const userId = req.user.userId;
        const users = await friendService.searchUsers(userId, q);
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
