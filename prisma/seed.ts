import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function seedTeams() {
  console.log("Seeding teams...");
  // TODO: Fetch from NHL API in issue #3/#4
  console.log("  (skipped — NHL API integration not yet implemented)");
}

async function seedPlayers() {
  console.log("Seeding players...");
  // TODO: Fetch from NHL API in issue #3/#4
  console.log("  (skipped — NHL API integration not yet implemented)");
}

async function seedSkaterStats() {
  console.log("Seeding skater season stats...");
  // TODO: Fetch from NHL API in issue #3/#4
  console.log("  (skipped — NHL API integration not yet implemented)");
}

async function seedGoalieStats() {
  console.log("Seeding goalie season stats...");
  // TODO: Fetch from NHL API in issue #3/#4
  console.log("  (skipped — NHL API integration not yet implemented)");
}

async function seedTeamStats() {
  console.log("Seeding team season stats...");
  // TODO: Fetch from NHL API in issue #3/#4
  console.log("  (skipped — NHL API integration not yet implemented)");
}

async function main() {
  console.log("Starting StatStack database seed...\n");

  // Order matters: teams before players, players before stats
  await seedTeams();
  await seedPlayers();
  await seedSkaterStats();
  await seedGoalieStats();
  await seedTeamStats();

  console.log("\nSeed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
