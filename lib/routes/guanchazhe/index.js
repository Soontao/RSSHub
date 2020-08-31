const got = require('@/utils/got');
const cheerio = require('cheerio');
const moment = require("moment");

const ptype = {
    all: { name: '首页Feeds', url: 'https://www.guancha.cn/' },
    redian: { name: '热点新闻', url: 'https://www.guancha.cn/api/redian.htm' },
    member: { name: '观察者', url: 'https://www.guancha.cn/api/member.htm' },
    gundong: { name: '滚动新闻', url: 'https://www.guancha.cn/api/new_gundong.htm' },
};
// 2020-08-31 08:14:58
const DATE_FORMAT = "YYYY-MM-DD hh:mm:ss";

module.exports = async (ctx) => {
    const type = ctx.params.type;
    const host = 'https://www.guancha.cn';
    const url = ptype[type];
    let items = [];

    if (url !== undefined) {
        const listRes = await got(url.url);
        const $ = cheerio.load(listRes.body);
        const newsItem = $("h4 a").toArray();
        const links = newsItem.map((newsItem) => {
            const itemHref = $(newsItem).attr("href");
            if (itemHref.startsWith("http")) {
                return itemHref;
            }
            return `${host}${itemHref}`;
        }).filter((link) => link.startsWith(host)).slice(0, 20);

        items = await Promise.all(links.map((itemLink) => ctx.cache.tryGet(itemLink, async () => {
            const itemRes = await got(itemLink);
            const $item = cheerio.load(itemRes.body);
            const title = (
                $item("body > div.content > div.main.content-main > ul > li.left.left-main > h3").text()
            );
            const description = (
                $item("body > div.content > div.main.content-main > ul > li.left.left-main > div.content.all-txt").html().trim()
            );

            try {
                const pubDateString = $item($item(".time.fix span:nth-child(1)").get(0)).text();

                return {
                    title,
                    description,
                    link: itemLink,
                    pubDate: moment(pubDateString, DATE_FORMAT).toDate(),
                    guid: itemLink,
                };

            } catch (error) {
                throw new Error(`find date time in ${itemLink} failed`);
            }

        })));

    }

    ctx.state.data = {
        title: `观察者-首页新闻`,
        link: host,
        description: `观察者网，致力于荟萃中外思想者精华，鼓励青年学人探索，建中西文化交流平台，为崛起中的精英提供决策参考。`,
        allowEmpty: true,
        item: items
    };
};
