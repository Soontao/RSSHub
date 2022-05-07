const got = require('got');
const cheerio = require('cheerio');
const { uniq, sortBy } = require('@newdash/newdash');
const { Semaphore } = require('@newdash/newdash/functional/Semaphore');

const sem = new Semaphore(3);

/**
 * @param {RSSHubContext} ctx
 */
const endpoint = async (ctx) => {
    const url = 'https://www.jiemian.com/';

    const listResponse = await got(url);
    const $ = cheerio.load(listResponse.body);
    const title = '界面新闻';
    const links = uniq(Array.from($('a[content_type=\'article\']').map((_, item) => 'https://www.jiemian.com/article/' + $(item).attr('content_id') + '.html')));

    const items = await Promise.all(
        links.map((link) => ctx.cache.tryGet(
            link,
            async () => sem.use(async () => {
                const itemResponse = await got(link);
                const $ = cheerio.load(itemResponse.body);
                return {
                    title: $('h1').first().text(),
                    author: Array.from($('.article-info .author a').map((_, v) => $(v).text())).join(', '),
                    pubDate: new Date($('div.article-info > p > span:nth-child(2)').first().text() ||  $('.date').first().text().substring(0, 16)),
                    link,
                    guid: link,
                    description: $('.article-main').first().html(),
                };
            })
        ))
    );

    ctx.state.data = {
        title,
        link: url,
        item: sortBy(items, ['pubDate']),
    };
};

/**
 * endpoint path
 */
endpoint.path = '/news/jiemian';

endpoint.name = '界面新闻';

endpoint.examples = ['/news/jiemian'];

module.exports = endpoint;
