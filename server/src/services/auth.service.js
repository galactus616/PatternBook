import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../db/client.js";
import { generateUniqueUsername } from "../utils/username.helper.js";
import * as notificationService from "./notification.service.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const googleLogin = async (accessToken) => {
    // Fetch User Profile from Google using the Access Token
    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { email, name, picture, sub: googleId } = googleRes.data;

    // Upsert User in Database
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        const username = await generateUniqueUsername(name, email);
        user = await prisma.user.create({
            data: {
                email,
                name,
                username,
                picture, 
                provider: "GOOGLE",
                password: await bcrypt.hash(Math.random().toString(36), 10),
            }
        });
        // Create welcome notification
        notificationService.createNotification(
            user.id,
            "WELCOME",
            "Welcome to PatternBook! Start tracking your DSA progress today."
        );
    } else {
        // Update picture ONLY if hasCustomPicture is false
        const dataToUpdate = { provider: "GOOGLE" };
        if (!user.hasCustomPicture) {
            dataToUpdate.picture = picture;
        }

        user = await prisma.user.update({
            where: { email },
            data: dataToUpdate
        });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username, plan: user.plan },
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
    const defaultPicture = `avvatar:${email}`;
    const username = await generateUniqueUsername(name, email);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name,
            username,
            picture: defaultPicture,
            provider: "EMAIL",
        },
    });

    // Create welcome notification
    notificationService.createNotification(
        user.id,
        "WELCOME",
        "Welcome to PatternBook! Start tracking your DSA progress today."
    );

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
            username: user.username,
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