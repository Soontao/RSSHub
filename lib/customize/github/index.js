const got = require('@/utils/got');
const cheerio = require('cheerio');
const moment = require('moment');

const endpoint = async (ctx) => {

    const httpConfig = { timeout: 10 * 1000 } // timeout
    const date = moment().format('YYYY-MM-DD');
    const since = ctx.params.since;
    const language = ctx.params.language || '';
    const url = `https://github.com/trending/${encodeURIComponent(language)}?since=${since}`;

    const response = await got({
        method: 'get',
        url: url,
        headers: {
            Referer: url,
        },
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const articles = $('article').get().map((ele) => {
        const $item = $(ele)
        return {
            title: $item.find('h1').text(),
            link: `https://github.com${$item.find('h1 a').attr('href')}`,
        }
    })
    const item = await Promise.all(
        articles.map(({ title, link }) => {
            return ctx.cache.tryGet(`${date}-${link}`, async () => {
                const itemPage = await got(link, httpConfig);
                const $itemPage = cheerio.load(itemPage.data);
                const sDateTime = $itemPage('relative-time').attr('datetime');
                return {
                    title,
                    description: $itemPage('article').html(),
                    pubDate: new Date(sDateTime),
                    link,
                };
            });
        })
    );

    ctx.state.data = {
        title: $('title').text(),
        link: url,
        item,
    };
};


endpoint.path = '/github/trending/:since/:language?';

endpoint.name = 'Github Trending';

endpoint.examples = ['/github/trending/daily'];

module.exports = endpoint