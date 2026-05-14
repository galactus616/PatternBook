import { getTopics } from "../services/topic.service.js";

export const listTopics = async (req, res) => {
  try {
    const topics = await getTopics();

    res.json({
      success: true,
      data: topics.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        order: t.order,
        problemCount: t._count.problems,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not fetch topics",
    });
  }
};
