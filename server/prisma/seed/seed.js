import { PrismaClient } from "@prisma/client";
import problems from "./problems.json" with { type: "json" };

const prisma = new PrismaClient();

const mapDifficulty = (d) => d.toUpperCase();
const mapPriority = (p) => p.toUpperCase().replace(" ", "_");
const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

async function main() {
  console.log("Seeding started...");

  const topic = await prisma.topic.upsert({
    where: { name: "Arrays" },
    update: {},
    create: { name: "Arrays" },
  });

  const patternsCache = new Map();
  const subPatternsCache = new Map();

  for (const item of problems) {
    // 1. Handle Pattern
    if (!patternsCache.has(item.pattern)) {
      const p = await prisma.pattern.upsert({
        where: { name_topicId: { name: item.pattern, topicId: topic.id } },
        update: {},
        create: { name: item.pattern, topicId: topic.id },
      });
      patternsCache.set(item.pattern, p);
    }
    const pattern = patternsCache.get(item.pattern);

    // 2. Handle SubPattern
    const subKey = `${item.subPattern}-${pattern.id}`;
    if (!subPatternsCache.has(subKey)) {
      const sp = await prisma.subPattern.upsert({
        where: { name_patternId: { name: item.subPattern, patternId: pattern.id } },
        update: {},
        create: { name: item.subPattern, patternId: pattern.id },
      });
      subPatternsCache.set(subKey, sp);
    }
    const subPattern = subPatternsCache.get(subKey);

    // 3. Handle Problem
    await prisma.problem.upsert({
      where: { order: item.order },
      update: {
        title: item.title,
        leetcodeId: item.leetcodeId,
        leetcodeUrl: `https://leetcode.com/problems/${slugify(item.title)}/`,
        difficulty: mapDifficulty(item.difficulty),
        priority: mapPriority(item.priority),
        phase: parseInt(item.phase.replace("P", "")),
        patternId: pattern.id,
        subPatternId: subPattern.id,
        topicId: topic.id,
        hint: item.hint || null,
        timeEstimate: item.timeEstimate || null,
      },
      create: {
        order: item.order,
        title: item.title,
        leetcodeId: item.leetcodeId,
        leetcodeUrl: `https://leetcode.com/problems/${slugify(item.title)}/`,
        difficulty: mapDifficulty(item.difficulty),
        priority: mapPriority(item.priority),
        phase: parseInt(item.phase.replace("P", "")),
        patternId: pattern.id,
        subPatternId: subPattern.id,
        topicId: topic.id,
        hint: item.hint || null,
        timeEstimate: item.timeEstimate || null,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());