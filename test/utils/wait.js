const wait = require('../../lib/utils/wait');

describe('wait', () => {
    it('wait 0.1 second', async () => {
        const startDate = new Date();

        await wait(0.1 * 1000);

        const endDate = new Date();
        expect(endDate - startDate).toBeGreaterThan(90);
    });
});
