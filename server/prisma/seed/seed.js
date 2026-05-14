// prisma/seed/seed.js

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import topics from "../data/topics.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Constants & Validation
// ---------------------------------------------------------------------------

const VALID_ENUMS = {
  Difficulty: ["EASY", "MEDIUM", "HARD"],
  Priority: ["MUST_DO", "GOOD", "OPTIONAL"],
  Frequency: ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"],
};

const REQUIRED_PROBLEM_FIELDS = ["title", "difficulty", "priority", "pattern", "subPattern"];

// Topic slug → JSON filename mapping (auto-discovered)
const DATA_DIR = path.resolve(__dirname, "..", "data");

function discoverDatasets() {
  const datasets = new Map();
  const files = fs.readdirSync(DATA_DIR);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const slug = file.replace(".json", "");
    const filePath = path.join(DATA_DIR, file);

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) {
        console.warn(`  ⚠ ${file}: not an array, skipping`);
        continue;
      }
      datasets.set(slug, data);
    } catch (err) {
      console.warn(`  ⚠ ${file}: parse error — ${err.message}`);
    }
  }

  return datasets;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateProblem(item, topicSlug, index) {
  const errors = [];

  for (const field of REQUIRED_PROBLEM_FIELDS) {
    if (!item[field]) errors.push(`missing "${field}"`);
  }

  if (item.difficulty && !VALID_ENUMS.Difficulty.includes(item.difficulty)) {
    errors.push(`invalid difficulty "${item.difficulty}"`);
  }
  if (item.priority && !VALID_ENUMS.Priority.includes(item.priority)) {
    errors.push(`invalid priority "${item.priority}"`);
  }
  if (item.frequency && !VALID_ENUMS.Frequency.includes(item.frequency)) {
    errors.push(`invalid frequency "${item.frequency}"`);
  }

  if (errors.length) {
    console.warn(
      `  ⚠ [${topicSlug} #${index + 1}] "${item.title || "untitled"}": ${errors.join(", ")}`
    );
  }

  return errors.length === 0;
}

// ---------------------------------------------------------------------------
// Seed: Topics
// ---------------------------------------------------------------------------

async function seedTopics() {
  console.log("\n📦 Seeding topics...");

  const topicMap = new Map();

  for (const topic of topics) {
    const created = await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: { name: topic.name, order: topic.order },
      create: { name: topic.name, slug: topic.slug, order: topic.order },
    });

    topicMap.set(topic.slug, created);
    console.log(`  ✓ ${topic.name} (order: ${topic.order})`);
  }

  return topicMap;
}

// ---------------------------------------------------------------------------
// Seed: Patterns & SubPatterns (batched per topic)
// ---------------------------------------------------------------------------

async function seedPatternsForTopic(topic, problems) {
  const patternCache = new Map();
  const subPatternCache = new Map();

  // Collect unique patterns from this topic's problems
  const patternEntries = [];
  const subPatternEntries = [];

  for (const item of problems) {
    const patternSlug = slugify(item.pattern);
    const patternKey = `${topic.id}-${patternSlug}`;

    if (!patternCache.has(patternKey)) {
      patternEntries.push({ name: item.pattern, slug: patternSlug, topicId: topic.id });
      patternCache.set(patternKey, null); // mark as pending
    }

    const subPatternSlug = slugify(item.subPattern);
    // We need patternId first, so just collect subPattern info for later
    subPatternEntries.push({
      patternKey,
      patternSlug,
      name: item.subPattern,
      slug: subPatternSlug,
    });
  }

  // Upsert all patterns for this topic
  for (const entry of patternEntries) {
    const pattern = await prisma.pattern.upsert({
      where: { topicId_slug: { topicId: entry.topicId, slug: entry.slug } },
      update: { name: entry.name },
      create: { name: entry.name, slug: entry.slug, topicId: entry.topicId },
    });

    const key = `${entry.topicId}-${entry.slug}`;
    patternCache.set(key, pattern);
  }

  // Upsert all subPatterns (need patternId from cache)
  const seenSubPatterns = new Set();

  for (const entry of subPatternEntries) {
    const pattern = patternCache.get(entry.patternKey);
    if (!pattern) continue;

    const subPatternKey = `${pattern.id}-${entry.slug}`;
    if (seenSubPatterns.has(subPatternKey)) continue;
    seenSubPatterns.add(subPatternKey);

    const subPattern = await prisma.subPattern.upsert({
      where: { patternId_slug: { patternId: pattern.id, slug: entry.slug } },
      update: { name: entry.name },
      create: { name: entry.name, slug: entry.slug, patternId: pattern.id },
    });

    subPatternCache.set(subPatternKey, subPattern);
  }

  return { patternCache, subPatternCache };
}

// Seed: Problems

async function seedProblems(topic, problems, patternCache, subPatternCache) {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < problems.length; i++) {
    const item = problems[i];

    if (!validateProblem(item, topic.slug, i)) {
      skipped++;
      continue;
    }

    const patternSlug = slugify(item.pattern);
    const patternKey = `${topic.id}-${patternSlug}`;
    const pattern = patternCache.get(patternKey);

    const subPatternSlug = slugify(item.subPattern);
    const subPatternKey = `${pattern.id}-${subPatternSlug}`;
    const subPattern = subPatternCache.get(subPatternKey);

    if (!pattern || !subPattern) {
      console.warn(`  ⚠ Skipping "${item.title}" — pattern/subPattern not found`);
      skipped++;
      continue;
    }

    const problemSlug = `${topic.slug}-${item.slug || slugify(item.title)}`;

    // Use slug as the unique identifier for upsert (slug is @unique on Problem)
    const existing = await prisma.problem.findFirst({
      where: {
        OR: [
          { slug: problemSlug },
          { topicId: topic.id, order: item.order },
        ],
      },
    });

    if (existing) {
      // Update existing problem
      await prisma.problem.update({
        where: { id: existing.id },
        data: {
          title: item.title,
          slug: problemSlug,
          order: item.order,
          leetcodeId: item.leetcodeId || null,
          leetcodeUrl: item.leetcodeUrl || null,
          difficulty: item.difficulty,
          priority: item.priority,
          frequency: item.frequency || "MEDIUM",
          relatedPatterns: item.relatedPatterns || [],
          tags: item.tags || [],
          companies: item.companies || [],
          hint: item.hint || null,
          intuition: item.intuition || null,
          commonMistakes: item.commonMistakes || [],
          timeEstimate: item.timeEstimate || null,
          revisionPriority: item.revisionPriority || 5,
          isPro: item.isPro || false,
          topicId: topic.id,
          patternId: pattern.id,
          subPatternId: subPattern.id,
        },
      });
      updated++;
    } else {
      // Create new problem
      await prisma.problem.create({
        data: {
          title: item.title,
          slug: problemSlug,
          order: item.order,
          leetcodeId: item.leetcodeId || null,
          leetcodeUrl: item.leetcodeUrl || null,
          difficulty: item.difficulty,
          priority: item.priority,
          frequency: item.frequency || "MEDIUM",
          relatedPatterns: item.relatedPatterns || [],
          tags: item.tags || [],
          companies: item.companies || [],
          hint: item.hint || null,
          intuition: item.intuition || null,
          commonMistakes: item.commonMistakes || [],
          timeEstimate: item.timeEstimate || null,
          revisionPriority: item.revisionPriority || 5,
          isPro: item.isPro || false,
          topicId: topic.id,
          patternId: pattern.id,
          subPatternId: subPattern.id,
        },
      });
      created++;
    }
  }

  return { created, updated, skipped };
}

// Cleanup: Remove orphaned problems that are no longer in data files

async function cleanupOrphanedProblems(topic, currentSlugs) {
  const existingProblems = await prisma.problem.findMany({
    where: { topicId: topic.id },
    select: { id: true, slug: true, title: true },
  });

  const orphaned = existingProblems.filter((p) => !currentSlugs.has(p.slug));

  if (orphaned.length > 0) {
    console.log(`  🗑 Removing ${orphaned.length} orphaned problems from ${topic.name}:`);
    for (const p of orphaned) {
      console.log(`    - ${p.title} (${p.slug})`);
    }

    await prisma.problem.deleteMany({
      where: { id: { in: orphaned.map((p) => p.id) } },
    });
  }

  return orphaned.length;
}

// Cleanup: Remove orphaned patterns/subpatterns with no problems

async function cleanupOrphanedPatterns(topicId) {
  // SubPatterns with no problems
  const orphanedSubPatterns = await prisma.subPattern.findMany({
    where: {
      pattern: { topicId },
      problems: { none: {} },
    },
    select: { id: true, name: true },
  });

  if (orphanedSubPatterns.length > 0) {
    await prisma.subPattern.deleteMany({
      where: { id: { in: orphanedSubPatterns.map((sp) => sp.id) } },
    });
    console.log(`  🗑 Removed ${orphanedSubPatterns.length} orphaned subPatterns`);
  }

  // Patterns with no problems and no subPatterns
  const orphanedPatterns = await prisma.pattern.findMany({
    where: {
      topicId,
      problems: { none: {} },
      subPatterns: { none: {} },
    },
    select: { id: true, name: true },
  });

  if (orphanedPatterns.length > 0) {
    await prisma.pattern.deleteMany({
      where: { id: { in: orphanedPatterns.map((p) => p.id) } },
    });
    console.log(`  🗑 Removed ${orphanedPatterns.length} orphaned patterns`);
  }
}

// Main

async function main() {
  console.log("🚀 PatternBook seeding started...\n");

  // Discover all JSON data files
  console.log("📂 Discovering data files...");
  const datasets = discoverDatasets();
  console.log(`  Found ${datasets.size} datasets: ${[...datasets.keys()].join(", ")}\n`);

  // Validate all data upfront before any DB operations
  console.log("🔍 Validating data...");
  let totalProblems = 0;
  let totalValid = 0;
  let totalInvalid = 0;

  for (const [slug, problems] of datasets) {
    totalProblems += problems.length;
    for (let i = 0; i < problems.length; i++) {
      if (validateProblem(problems[i], slug, i)) {
        totalValid++;
      } else {
        totalInvalid++;
      }
    }
  }

  console.log(`  ${totalProblems} problems: ${totalValid} valid, ${totalInvalid} invalid\n`);

  if (totalInvalid > 0) {
    console.warn("⚠ Some problems have validation errors. They will be skipped.\n");
  }

  // Seed topics
  const topicMap = await seedTopics();

  // Seed each topic's problems
  const summary = { topics: 0, created: 0, updated: 0, skipped: 0, orphanedProblems: 0 };

  for (const [topicSlug, problems] of datasets) {
    const topic = topicMap.get(topicSlug);

    if (!topic) {
      console.warn(`\n⚠ Skipping "${topicSlug}" — no matching topic defined`);
      continue;
    }

    console.log(`\n📦 Seeding ${topic.name} (${problems.length} problems)...`);

    // Seed patterns & subPatterns first
    const { patternCache, subPatternCache } = await seedPatternsForTopic(topic, problems);

    // Seed problems
    const result = await seedProblems(topic, problems, patternCache, subPatternCache);
    console.log(
      `  ✓ ${result.created} created, ${result.updated} updated, ${result.skipped} skipped`
    );

    // Cleanup orphaned problems
    const currentSlugs = new Set(
      problems
        .filter((p) => validateProblem(p, topicSlug, 0))
        .map((p) => `${topicSlug}-${p.slug || slugify(p.title)}`)
    );
    const orphanedCount = await cleanupOrphanedProblems(topic, currentSlugs);

    // Cleanup orphaned patterns/subpatterns
    await cleanupOrphanedPatterns(topic.id);

    summary.topics++;
    summary.created += result.created;
    summary.updated += result.updated;
    summary.skipped += result.skipped;
    summary.orphanedProblems += orphanedCount;
  }

  // Final summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Seed Summary:");
  console.log(`  Topics processed:  ${summary.topics}`);
  console.log(`  Problems created:  ${summary.created}`);
  console.log(`  Problems updated:  ${summary.updated}`);
  console.log(`  Problems skipped:  ${summary.skipped}`);
  console.log(`  Orphans removed:   ${summary.orphanedProblems}`);
  console.log("=".repeat(50));

  console.log("\n✅ Seeding complete.");
}

main()
  .catch((error) => {
    console.error("\n❌ Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });