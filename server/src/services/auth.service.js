import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../db/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Google Login
export const googleLogin = async (accessToken) => {
    // 1. Fetch User Profile from Google using the Access Token
    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { email, name, picture, sub: googleId } = googleRes.data;

    // 2. Upsert User in Database
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name,
                picture, 
                provider: "GOOGLE",
                password: await bcrypt.hash(Math.random().toString(36), 10),
            }
        });
    } else {
        // Update picture if it exists or has changed
        user = await prisma.user.update({
            where: { email },
            data: { picture, provider: "GOOGLE" }
        });
    }

    // 3. Generate local PatternBook JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email, plan: user.plan },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
};

export const registerUser = async ({ email, password, name }) => {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        throw new Error("This email is already registered. Try logging in instead!");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name,
            provider: "EMAIL",
        },
    });

    const { password: _, ...safeUser } = user;

    return safeUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("Invalid email or password. Please try again.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password. Please try again.");

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            plan: user.plan
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
};

export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    const { password: _, ...safeUser } = user;
    return safeUser;
};