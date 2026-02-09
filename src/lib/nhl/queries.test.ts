import assert from "node:assert/strict";
import test from "node:test";

import { withFallback } from "@/lib/nhl/queries";

function restoreNodeEnv(previous: string | undefined) {
  if (previous === undefined) {
    delete process.env.NODE_ENV;
    return;
  }
  process.env.NODE_ENV = previous;
}

test("withFallback returns fallback in development mode", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  let fallbackCalled = false;
  const logged: unknown[][] = [];
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    logged.push(args);
  };

  try {
    const result = await withFallback(
      async () => {
        throw new Error("query failed");
      },
      () => {
        fallbackCalled = true;
        return "mock-data";
      },
      "testQuery",
    );

    assert.equal(result, "mock-data");
    assert.equal(fallbackCalled, true);
    assert.equal(logged.length, 1);
    assert.equal(logged[0][0], "[nhl/queries] query_failed");
    const details = logged[0][1] as Record<string, unknown>;
    assert.equal(details.queryName, "testQuery");
    assert.equal(details.environment, "development");
    assert.equal(details.fallbackUsed, true);
    assert.equal(details.errorName, "Error");
    assert.equal(details.errorMessage, "query failed");
  } finally {
    console.error = originalConsoleError;
    restoreNodeEnv(previousNodeEnv);
  }
});

test("withFallback rethrows in production mode and does not use fallback", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  let fallbackCalled = false;
  const logged: unknown[][] = [];
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    logged.push(args);
  };

  try {
    await assert.rejects(
      withFallback(
        async () => {
          throw new Error("db unavailable");
        },
        () => {
          fallbackCalled = true;
          return "mock-data";
        },
        "testQuery",
      ),
      /db unavailable/,
    );

    assert.equal(fallbackCalled, false);
    assert.equal(logged.length, 1);
    assert.equal(logged[0][0], "[nhl/queries] query_failed");
    const details = logged[0][1] as Record<string, unknown>;
    assert.equal(details.queryName, "testQuery");
    assert.equal(details.environment, "production");
    assert.equal(details.fallbackUsed, false);
    assert.equal(details.errorName, "Error");
    assert.equal(details.errorMessage, "db unavailable");
  } finally {
    console.error = originalConsoleError;
    restoreNodeEnv(previousNodeEnv);
  }
});
