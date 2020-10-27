const got = require('@/utils/got');
const cheerio = require('cheerio');
const { uniq } = require('@newdash/newdash');
const { removeHTMLComments } = require('@/utils/html');

const parseContent = ($item) => {
    $item('.page_css').remove();
    $item('.post_ding_top.cur').remove();
    $item('.Content_Paging').remove();
    $item('.rights').remove();
    removeHTMLComments($item);
    const content = $item('.MidL_con').html() || $item('.Mid2L_con').html();
    return content;
};

const authorRegExp = /^.*?作者：(.*?) .*?$/;

const getAuthorFromString = (str = '') => {
    const result = authorRegExp.exec(str.trim());
    return result !== null ? result[1] : undefined;
};

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
                let itemRes = await got(item.link);
                let $item = cheerio.load(itemRes.body);
                const redirectLink = $item('#redirectTips').attr('data-link');

                item.author = getAuthorFromString($item('.detail').text().trim());

                if (redirectLink) {

                    // is club page
                    item.link = redirectLink;
                    itemRes = await got(item.link);
                    $item = cheerio.load(itemRes.body);
                    $item('.rights').remove();
                    removeHTMLComments($item);
                    item.description = $item('.qzcmt-content').html();
                    item.author = $item('.uname').text().trim();

                } else if (item.link.includes('www.gamersky.com/review')) {

                    // is review page
                    removeHTMLComments($item);
                    const content = $item('.MidLcon');
                    item.description = content.html();

                } else {

                    const pageContents = [];

                    let morePagesLinks = $item('.page_css a').map((_, item) => $item(item).attr('href')).get();
                    morePagesLinks = uniq(morePagesLinks);
                    morePagesLinks = morePagesLinks.filter((l) => l !== item.link);

                    pageContents.push(parseContent($item));

                    await Promise.all(
                        morePagesLinks.map((link) => ctx.cache.tryGet(link, async () => {
                            const morePage = await got(link);
                            const $MorePage = cheerio.load(morePage.body);
                            pageContents.push(parseContent($MorePage));

                        }))
                    );

                    item.description = pageContents.map((c) => c.trim()).join('<br>');
                }

                item.author = item.author || '游民星空'; // default user

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
