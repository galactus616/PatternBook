import { prisma } from "../db/client.js";

// Helper to generate a unique username
export const generateUniqueUsername = async (name, email) => {
    const base = (name || email.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .slice(0, 15);
    
    let isUnique = false;
    let username = base;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
        const existing = await prisma.user.findUnique({ where: { username } });
        if (!existing) {
            isUnique = true;
        } else {
            const random = Math.random().toString(36).substring(2, 6);
            username = `${base}_${random}`;
            attempts++;
        }
    }
    return username;
};