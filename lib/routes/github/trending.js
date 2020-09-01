const got = require('@/utils/got');
const cheerio = require('cheerio');
const moment = require('moment');

module.exports = async (ctx) => {
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
    const list = $('article');
    const item = await Promise.all(
        list
            .map((index, item) => {
                item = $(item);
                const link = `https://github.com${item.find('h1 a').attr('href')}`;
                const key = `${date}-${link}`;
                return ctx.cache.tryGet(key, () => ({
                    title: item.find('h1').text(),
                    description: `${item.find('.pr-4').text()}<br>
                                <br>Language: ${item.find('span[itemprop="programmingLanguage"]').text() || 'unknown'}
                                <br>Star: ${item.find('.muted-link').eq(0).text()}
                                <br>Fork: ${item.find('.muted-link').eq(1).text()}`,
                    link,
                }));
            })
            .get()
    );

    ctx.state.data = {
        title: $('title').text(),
        link: url,
        item,
    };
};
