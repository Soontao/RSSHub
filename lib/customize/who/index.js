const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');
const { Semaphore } = require('@newdash/newdash/functional/Semaphore');

const sem = new Semaphore(3);

/**
 * @param {import("koa").Context} ctx
 */
const endpoint = async (ctx) => {
    const url = 'https://www.who.int/api/hubs/newsitems?sf_provider=OpenAccessDataProvider&sf_culture=zh&$orderby=PublicationDateAndTime%20desc&%24format=json&$top=10';

    const title = '世卫组织的新闻稿';
    const listResponse = await fetch(url);
    const listItems = (await listResponse.json()).value;
    const items = await Promise.all(
        listItems.map((listItem) => {
            const link = `https://www.who.int/zh/news/item${listItem.ItemDefaultUrl}`;

            return ctx.cache.tryGet(
                link,
                async () => sem.use(async () => {
                    const itemResponse = await got(link);
                    const $item = cheerio.load(itemResponse.body);
                    return {
                        title: listItem.Title,
                        pubDate: moment(listItem.PublicationDateAndTime).toDate(),
                        link,
                        guid: link,
                        description: $item('article').html(),
                        author: $item($item('.sf-item-header-wrapper .sf-tags-list-item').get(0)).text()
                    };
                })
            );
        })
    );

    ctx.state.data = {
        title,
        link: url,
        item: items,
    };
};

/**
 * endpoint path
 */
endpoint.path = '/who/news';

endpoint.name = 'WHO News';

endpoint.examples = ['/who/news'];

module.exports = endpoint;
