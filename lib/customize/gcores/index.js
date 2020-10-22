const got = require('@/utils/got');
const cheerio = require('cheerio');
const moment = require('moment');

// 2020-08-31T11:00:00.000+08:00
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

const RADIO_MP3_REG = /https:\/\/alioss.gcores.com\/uploads\/audio\/.*?\.mp3/gm;

const endpoint = async (ctx) => {
    const category = ctx.params.category;
    const url = `https://www.gcores.com/${category}`;
    const res = await got(url);
    const data = res.data;
    const $ = cheerio.load(data);
    const list = $('.original.am_card.original-normal').toArray();
    const feedTitle = $('title').text();

    const out = await Promise.all(
        list.map(async (item) => {
            const itemPath = $(item).find('a.am_card_content.original_content').attr('href');
            const itemUrl = 'https://www.gcores.com' + itemPath;
            const parts = itemUrl.split('/');
            const itemId = parts.pop();
            const itemType = parts.pop();
            const apiUrl = `https://www.gcores.com/gapi/v1/${itemType}/${itemId}?include=user,djs`;

            return ctx.cache.tryGet(itemUrl, async () => {
                const [apiRes, itemRes] = await Promise.all([got(apiUrl), got(itemUrl)]);
                const itemPage = itemRes.data;
                const $item = cheerio.load(itemPage);

                const title = $item('div.originalPage_titleGroup h1').text();
                const cover = $item('img.newsPage_cover');
                $item('path').remove();
                $item('svg').remove();
                // remove loading indicator
                $item('.loadingPlaceholder').remove();
                $item('.md-editor-toolbar').remove();

                const content = $item('.story.story-show').html();
                const single = {
                    title: title,
                    description: cover + content,
                    link: itemUrl,
                    pubDate: moment.parseZone(apiRes.data.data.attributes['published-at'], DATE_FORMAT).toDate(),
                    guid: itemUrl,
                    author: apiRes.data.included.map((include) => include.attributes.nickname).join(', ')
                };

                if (itemType === 'radios') {
                    const [radioLink] = (itemRes.data.match(RADIO_MP3_REG) || []);
                    if (radioLink !== undefined) {
                        single.enclosure_url = radioLink;
                        single.enclosure_type = 'audio/mpeg';
                        single.description += `<br><audio controls><source src="${radioLink}" type="audio/mpeg"></audio>`;
                    }
                }

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

endpoint.name = '机核网';

endpoint.path = '/gcores/category/:category';

endpoint.examples = ['/gcores/category/radios', '/gcores/category/articles'];

module.exports = endpoint;