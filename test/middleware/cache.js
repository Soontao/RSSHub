const { RedisCache } = require('../../lib/middleware/cache/redis');
const { InMemoryCache } = require('../../lib/middleware/cache/memory');

const wait = require('../../lib/utils/wait');
const uuid = require('uuid');

describe('cache', () => {

    it('memory', async () => {
        process.env.CACHE_TYPE = 'memory';
        const cache = new InMemoryCache();

        await cache.syncReady();
        const key = uuid.v4();
        const v1 = uuid.v4();
        await cache.set(key, v1, 1); // remove after 1 seconds
        expect(await cache.get(key)).toBe(v1);
        await wait(5 * 1000);
        expect(await cache.get(key)).toBeNull();


    }, 10000);

    if (process.env.REDIS_URL !== undefined) {

        it('redis', async () => {

            const client = new RedisCache();
            await client.syncReady();
            const key = uuid.v4();
            const v1 = uuid.v4();
            await client.set(key, v1, 1);
            expect(await client.get(key)).toBe(v1);
            await wait(1 * 1000 + 100);
            expect(await client.get(key)).toBeNull();


        }, 10000);


    }


});
