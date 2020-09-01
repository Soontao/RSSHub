const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.gamersky.com/news/',
        headers: {
            Referer: 'https://www.gamersky.com/news/',
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);
    const links = $('.Mid2L_con li')
        .slice(0, 10)
        .map(function () {
            return {
                title: $(this).find('.tt').text(),
                link: $(this).find('.tt').attr('href'),
                pubDate: new Date($(this).find('.time').text()).toUTCString(),
            };
        })
        .get();

    const items = await Promise.all(
        links.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const itemRes = await got(item.link);
                const $item = cheerio.load(itemRes.body);
                item.description = $item('.MidL_con').html() || $item('.Mid2L_con').html();
                return item;
            })
        )
    );

    ctx.state.data = {
        title: '游民星空-今日推荐',
        link: 'https://www.gamersky.com/news/',
        item: items,
    };
};
