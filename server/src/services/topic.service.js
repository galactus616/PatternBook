import { prisma } from "../db/client.js";

export const getTopics = async () => {
  return prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { problems: true },
      },
    },
  });
};
