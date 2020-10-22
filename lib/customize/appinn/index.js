const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');
const html = require('@/utils/html');
const { Semaphore } = require('@newdash/newdash/functional/Semaphore');

const sem = new Semaphore(3);

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
    const listItems = $('.title').get().slice(0, 10);
    const items = await Promise.all(
        listItems.map((listItem) => {
            const link = $(listItem).find('a').attr('href');

            return ctx.cache.tryGet(link, async () => sem.use(async () => {
                    const itemResponse = await got(link);
                    const $item = cheerio.load(itemResponse.body);
                    html.replaceNoScript($item);

                    const content = $item('.post-single-content');

                    content.find('.simplefavorite-button').remove();
                    content.find('.wpulike').remove();


                    return {
                        title: $item('.title').text(),
                        pubDate: moment($item('header > .post-info > .thetime.updated span').text(), 'YYYY/MM/DD'),
                        author: $item('.theauthor a').text(),
                        link,
                        guid: link,
                        description: content.html(),
                    };
                }));
        })
    );

    ctx.state.data = {
        title: site_name,
        link: site_url,
        item: items,
    };
};

endpoint.path = '/appinn';

endpoint.name = site_name;

endpoint.examples = ['/appinn'];

module.exports = endpoint;
