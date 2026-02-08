/**
 * Caching layer with configurable TTLs.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL is set,
 * otherwise falls back to an in-memory Map for local dev.
 */

export const TTL = {
  LIVE: 30,          // 30 seconds — live game data
  RECENT: 5 * 60,    // 5 minutes — recent stats
  STANDARD: 60 * 60, // 1 hour — general data
  HISTORICAL: 24 * 60 * 60, // 24 hours — historical/static data
} as const;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory cache for local development
const memoryCache = new Map<string, CacheEntry<unknown>>();

async function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await getRedis();

  if (redis) {
    const data = await redis.get<T>(key);
    return data ?? null;
  }

  // In-memory fallback
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  if (entry) {
    memoryCache.delete(key);
  }
  return null;
}

export async function cacheSet<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  const redis = await getRedis();

  if (redis) {
    await redis.set(key, data, { ex: ttlSeconds });
    return;
  }

  // In-memory fallback
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Fetch with cache: tries cache first, falls back to fetcher, stores result.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = TTL.RECENT,
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();
  await cacheSet(key, data, ttlSeconds);
  return data;
}
