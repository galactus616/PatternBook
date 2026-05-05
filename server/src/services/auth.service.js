import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async ({ email, password, name }) => {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name,
        },
    });

    const { password: _, ...safeUser } = user;

    return safeUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
};