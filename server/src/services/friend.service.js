import { prisma } from "../db/client.js";

/**
 * Send a friend request
 */
export const sendFriendRequest = async (senderId, receiverIdentifier) => {
    // 1. Find receiver (could be ID or username)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(receiverIdentifier);
    
    const receiver = await prisma.user.findUnique({
        where: isUuid ? { id: receiverIdentifier } : { username: receiverIdentifier },
        select: { id: true }
    });

    if (!receiver) throw new Error("User not found");
    if (receiver.id === senderId) throw new Error("You cannot add yourself as a friend");

    // 2. Check if relationship already exists
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
        if (existing.status === "BLOCKED") throw new Error("Cannot send request");
    }

    // 3. Create request
    return await prisma.friendship.create({
        data: {
            senderId,
            receiverId: receiver.id,
            status: "PENDING"
        }
    });
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (userId, requestId) => {
    const request = await prisma.friendship.findUnique({
        where: { id: requestId }
    });

    if (!request || request.receiverId !== userId) {
        throw new Error("Request not found or unauthorized");
    }

    if (request.status !== "PENDING") {
        throw new Error("Request is no longer pending");
    }

    return await prisma.friendship.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" }
    });
};

/**
 * Reject / Cancel friend request
 */
export const removeFriendship = async (userId, requestId) => {
    const friendship = await prisma.friendship.findUnique({
        where: { id: requestId }
    });

    if (!friendship || (friendship.senderId !== userId && friendship.receiverId !== userId)) {
        throw new Error("Friendship not found or unauthorized");
    }

    return await prisma.friendship.delete({
        where: { id: requestId }
    });
};

/**
 * Get all friends
 */
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
                select: { id: true, name: true, username: true, picture: true, plan: true }
            },
            receiver: {
                select: { id: true, name: true, username: true, picture: true, plan: true }
            }
        }
    });

    // Return the "other" person in the friendship
    return friendships.map(f => f.senderId === userId ? f.receiver : f.sender);
};

/**
 * Get pending requests
 */
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

/**
 * Search users to add
 */
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

    // Enrich with friendship status
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
        if (friendship) {
            if (friendship.status === "ACCEPTED") status = "FRIEND";
            else if (friendship.status === "PENDING") {
                status = friendship.senderId === userId ? "PENDING_SENT" : "PENDING_RECEIVED";
            }
        }

        return { ...user, friendshipStatus: status };
    }));

    return enrichedUsers;
};
