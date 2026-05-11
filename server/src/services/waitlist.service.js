import { prisma } from "../db/client.js";

export const joinWaitlist = async ({ email, type, message }) => {
  return prisma.waitlist.upsert({
    where: { email },
    update: { type, message },
    create: { email, type, message }
  });
};
