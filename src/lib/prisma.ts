import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return a throwing proxy so callers can gracefully fallback in their own try/catch.
    return new Proxy(
      {},
      {
        get() {
          throw new Error("DATABASE_URL is not configured");
        },
      },
    ) as PrismaClient;
  }

  // If the URL is a prisma+postgres:// Accelerate URL, decode the embedded
  // direct TCP connection string and use the pg adapter instead.
  if (url.startsWith("prisma+postgres://")) {
    const apiKey = new URL(url).searchParams.get("api_key");
    if (apiKey) {
      try {
        const decoded = JSON.parse(
          Buffer.from(apiKey, "base64").toString("utf-8"),
        ) as { databaseUrl?: string };
        if (decoded.databaseUrl) {
          const adapter = new PrismaPg({ connectionString: decoded.databaseUrl });
          return new PrismaClient({ adapter });
        }
      } catch {
        // Fall through to accelerateUrl
      }
    }
    return new PrismaClient({ accelerateUrl: url });
  }

  // Direct postgres:// URL — use pg adapter
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
