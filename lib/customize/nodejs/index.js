const got = require('got');
const cheerio = require('cheerio');

/**
 * endpoint path
 */
const path = '/nodejs/blogs';

/**
 *
 * @param {import("koa").Context} ctx
 */
const endpoint = async (ctx) => {
    const url = 'https://nodejs.org/en/blog/';

    const listResponse = await got(url);
    const $ = cheerio.load(listResponse.body);
    const listItems = $('#main > div > ul > li').get();
    const items = await Promise.all(
        listItems.map((listItem) => {
            const link = 'https://nodejs.org' + $(listItem).find('a').attr('href');

            return ctx.cache.tryGet(link, async () => {
                const itemResponse = await got(link);
                const $item = cheerio.load(itemResponse.body);
                return {
                    title: $item('#main > div > article > div > h1').text(),
                    pubDate: $item('#main > div > article > div > span > time').attr('datetime'),
                    link,
                    guid: link,
                    description: $item('#main > div > article').html(),
                };
            });
        })
    );

    ctx.state.data = {
        title: 'NodeJS Blogs',
        link: url,
        item: items,
    };
};

module.exports = {
    path,
    endpoint,
};
