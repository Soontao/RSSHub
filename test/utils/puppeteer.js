const puppeteer = require('../../lib/utils/puppeteer');
const wait = require('../../lib/utils/wait');

describe('puppeteer', () => {
    it('should support use puppeteer', async () => {
        const browser = await puppeteer();
        const page = await browser.newPage();
        await page.goto('https://www.qq.com', { waitUntil: 'domcontentloaded' });
        // eslint-disable-next-line no-undef
        const html = await page.evaluate(() => document.body.innerHTML);
        expect(html.length).toBeGreaterThan(0);
        await browser.close();
    });
    it('should support puppeteer auto close', async () => {
        const browser = await puppeteer(5 * 1000);
        expect((await browser.process()).exitCode).toBe(null);
        await wait(6 * 1000);
        expect((await browser.process()).exitCode).toBe(0);
    });
});
