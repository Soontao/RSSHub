const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');

/**
 * endpoint path
 */
const path = '/appinn';

/**
 * name of site
 */
const site_name = '小众软件';

/**
 * homepage/list of site
 */
const site_url = 'https://www.appinn.com/';

/**
 *
 * @param {import("koa").Context} ctx
 */
const endpoint = async (ctx) => {
    const url = site_url;

    const listResponse = await got(url);
    const $ = cheerio.load(listResponse.body);
    const listItems = $('.title').get();
    const items = await Promise.all(
        listItems.map((listItem) => {
            const link = $(listItem).find('a').attr('href');

            return ctx.cache.tryGet(link, async () => {
                const itemResponse = await got(link);
                const $item = cheerio.load(itemResponse.body);
                return {
                    title: $item('.title').text(),
                    pubDate: moment($item('header > .post-info > .thetime.updated span').text(), 'YYYY/MM/DD'),
                    link,
                    guid: link,
                    description: $item('.post-single-content').html(),
                };
            });
        })
    );

    ctx.state.data = {
        title: site_name,
        link: site_url,
        item: items,
    };
};

module.exports = {
    path,
    endpoint,
};
