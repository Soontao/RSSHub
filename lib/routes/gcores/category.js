const got = require('@/utils/got');
const cheerio = require('cheerio');
const moment = require("moment");

// 2020-08-31T11:00:00.000+08:00
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

module.exports = async (ctx) => {
    const category = ctx.params.category;
    const url = `https://www.gcores.com/${category}`;
    const res = await got({
        method: 'get',
        url: url,
    });
    const data = res.data;
    const $ = cheerio.load(data);
    const list = $('.original.am_card.original-normal').slice(0, 10).toArray();
    const feedTitle = $('title').text();

    const out = await Promise.all(
        list.map(async (item) => {
            let itemUrl = $(item).find('a.am_card_content.original_content').attr('href');
            itemUrl = 'https://www.gcores.com' + itemUrl;
            const apiUrl = `https://www.gcores.com/gapi/v1/articles/${itemUrl.split("/").pop()}`;

            return ctx.cache.tryGet(itemUrl, async () => {
                const apiRes = await got(apiUrl);
                const itemRes = await got({ method: 'get', url: itemUrl, });

                const itemPage = itemRes.data;
                const $item = cheerio.load(itemPage);

                const title = $item('h3.am_card_title').text();
                const cover = $item('img.newsPage_cover');
                const content = $item('.story.story-show').html();
                const single = {
                    title: title,
                    description: cover + content,
                    link: itemUrl,
                    pubDate: moment.parseZone(
                        apiRes.data.data.attributes['published-at'],
                        DATE_FORMAT
                    ).toDate(),
                    guid: itemUrl,
                };
                return single;
            });

        })
    );
    ctx.state.data = {
        title: feedTitle,
        link: url,
        item: out,
    };
};
