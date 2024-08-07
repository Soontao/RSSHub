const { RedisCache } = require("../../lib/middleware/cache/redis");
const { FileSystemCache } = require("../../lib/middleware/cache/fs");
const { InMemoryCache } = require("../../lib/middleware/cache/memory");

const wait = require("../../lib/utils/wait");
const uuid = require("uuid");

describe("cache test suite", () => {

  it("should support memory cache", async () => {
    const cache = new InMemoryCache();
    await cache.syncReady();
    const key = uuid.v4();
    const v1 = uuid.v4();
    await cache.set(key, v1, 0.5);
    expect(await cache.get(key)).toBe(v1);
    await wait(1000);
    expect(await cache.get(key)).toBeNull();
  });

  it("should support fs system cache", async () => {
    const cache = new FileSystemCache();
    await cache.syncReady();
    const key = uuid.v4();
    const v1 = uuid.v4();
    await cache.set(key, v1, 0.5);
    expect(await cache.get(key)).toBe(v1);
    await wait(1000);
    expect(await cache.get(key)).toBeNull();
  });

  if (process.env.REDIS_URL !== undefined) {
    it("should support redis cache", async () => {
      const client = new RedisCache();
      await client.syncReady();
      const key = uuid.v4();
      const v1 = uuid.v4();
      await client.set(key, v1, 1);
      expect(await client.get(key)).toBe(v1);
      await wait(1 * 1000 + 100);
      expect(await client.get(key)).toBeNull();
    });
  }
});
