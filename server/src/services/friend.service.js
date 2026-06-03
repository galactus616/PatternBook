import { prisma } from "../db/client.js";
import { io, getReceiverSocketId } from "../socket.js";
import * as notificationService from "./notification.service.js";

export const sendFriendRequest = async (senderId, receiverIdentifier) => {
    // 1. Find receiver
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(receiverIdentifier);
    
    const receiver = await prisma.user.findUnique({
        where: isUuid ? { id: receiverIdentifier } : { username: receiverIdentifier },
        select: { id: true, name: true, username: true }
    });

    if (!receiver) throw new Error("User not found");
    if (receiver.id === senderId) throw new Error("You cannot add yourself as a friend");

    // 2. Check existing
    const existing = await prisma.friendship.findFirst({
        where: {
            OR: [
                { senderId, receiverId: receiver.id },
                { senderId: receiver.id, receiverId: senderId }
            ]
        }
    });

    if (existing) {
        if (existing.status === "ACCEPTED") throw new Error("You are already friends");
        if (existing.status === "PENDING") {
            if (existing.senderId === senderId) throw new Error("Request already sent");
            else throw new Error("This user has already sent you a request");
        }
    }

    const newRequest = await prisma.friendship.create({
        data: { senderId, receiverId: receiver.id, status: "PENDING" },
        include: { sender: { select: { id: true, name: true, username: true, picture: true } } }
    });

    // REAL-TIME: Notify receiver
    const receiverSocketId = getReceiverSocketId(receiver.id);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newFriendRequest", newRequest);
    }

    // Save notification
    notificationService.createNotification(
        receiver.id,
        "FRIEND_REQUEST_RECEIVED",
        `${newRequest.sender.name || newRequest.sender.username} sent you a friend request.`,
        newRequest.id
    );

    return newRequest;
};

export const acceptFriendRequest = async (userId, requestId) => {
    const request = await prisma.friendship.findUnique({
        where: { id: requestId },
        include: { sender: true, receiver: true }
    });

    if (!request || request.receiverId !== userId) throw new Error("Unauthorized");

    const updated = await prisma.friendship.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" }
    });

    // REAL-TIME: Notify the person who sent the request
    const senderSocketId = getReceiverSocketId(request.senderId);
    if (senderSocketId) {
        io.to(senderSocketId).emit("friendRequestAccepted", {
            requestId: updated.id,
            user: request.receiver // The person who accepted
        });
    }

    // Save notification for sender
    notificationService.createNotification(
        request.senderId,
        "FRIEND_REQUEST_ACCEPTED",
        `${request.receiver.name || request.receiver.username} accepted your friend request.`,
        updated.id
    );

    return updated;
};

export const removeFriendship = async (userId, requestId) => {
    const friendship = await prisma.friendship.findUnique({
        where: { id: requestId }
    });

    if (!friendship || (friendship.senderId !== userId && friendship.receiverId !== userId)) {
        throw new Error("Unauthorized");
    }

    const otherId = friendship.senderId === userId ? friendship.receiverId : friendship.senderId;

    await prisma.friendship.delete({ where: { id: requestId } });

    // REAL-TIME: Notify other person
    const otherSocketId = getReceiverSocketId(otherId);
    if (otherSocketId) {
        io.to(otherSocketId).emit("friendRemoved", { requestId });
    }

    return { success: true };
};

export const getFriends = async (userId) => {
    const friendships = await prisma.friendship.findMany({
        where: {
            OR: [
                { senderId: userId, status: "ACCEPTED" },
                { receiverId: userId, status: "ACCEPTED" }
            ]
        },
        include: {
            sender: {
                select: { id: true, name: true, username: true, picture: true, plan: true, lastActiveDate: true }
            },
            receiver: {
                select: { id: true, name: true, username: true, picture: true, plan: true, lastActiveDate: true }
            }
        }
    });

    // Return the "other" person in the friendship with the friendshipId attached
    return friendships.map(f => {
        const friendObj = f.senderId === userId ? f.receiver : f.sender;
        return { ...friendObj, friendshipId: f.id };
    });
};

export const getPendingRequests = async (userId) => {
    return await prisma.friendship.findMany({
        where: {
            receiverId: userId,
            status: "PENDING"
        },
        include: {
            sender: {
                select: { id: true, name: true, username: true, picture: true }
            }
        }
    });
};

export const searchUsers = async (userId, query) => {
    if (!query || query.length < 2) return [];

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { username: { contains: query, mode: "insensitive" } }
            ],
            NOT: { id: userId } // don't find yourself
        },
        select: {
            id: true,
            name: true,
            username: true,
            picture: true,
            plan: true
        },
        take: 10
    });

    // Enrich with friendship status and friendshipId
    const enrichedUsers = await Promise.all(users.map(async (user) => {
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: user.id },
                    { senderId: user.id, receiverId: userId }
                ]
            }
        });

        let status = "NONE";
        let friendshipId = null;
        if (friendship) {
            friendshipId = friendship.id;
            if (friendship.status === "ACCEPTED") status = "FRIEND";
            else if (friendship.status === "PENDING") {
                status = friendship.senderId === userId ? "PENDING_SENT" : "PENDING_RECEIVED";
            }
        }

        return { ...user, friendshipStatus: status, friendshipId };
    }));

    return enrichedUsers;
};
