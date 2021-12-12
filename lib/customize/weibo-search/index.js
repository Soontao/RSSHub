const got = require('@/utils/got');
const date = require('@/utils/date');
const weiboUtils = require('../../routes/weibo/utils');
const cheerio = require('cheerio');
const { hash } = require('@newdash/newdash/functional/hash');
const { get } = require('@newdash/newdash/get');
const { flatten } = require('@newdash/newdash/flatten');


const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';

const toImageHtml = (status) => {
    let html = '';

    // 添加微博配图
    if (status && status.pics) {
        status.pics.forEach(function (item) {
            html += `<img src="${item.large.url}">`;
        });
    }
    return html;
};

const endpoint = async (ctx) => {

    const { keyword } = ctx.params;

    let { pages } = ctx.query;

    pages = pages === undefined ? 5 : pages;

    if (pages < 1) {
        pages = 1;
    }

    const containerId = encodeURIComponent(`100103type=61&q=${keyword}`);

    const responses = await Promise.all([...Array(pages).keys()].map((k) => k + 1).map((page) => got({
        method: 'get',
        url: `https://m.weibo.cn/api/container/getIndex?containerid=${containerId}&page_type=searchall&page=${page}`,
        headers: {
            'Referer':`https://m.weibo.cn/search?containerid=${containerId}`,
            'MWeibo-Pwa': 1,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': ua,
        },
    })));

    const resultItem = await Promise.all(
        flatten(responses.map((response) => response.data.data.cards))
            .filter((item) => item.card_type === 9 && item.mblog !== undefined && item.mblog.retweeted_status === undefined)
            .map(async (item) => {
                const status = item.mblog;
                const uid = item.mblog.user.id;

                // 是否通过api拿到了data
                const isDataOK = status !== undefined && status.text;

                if (isDataOK) {
                    item.mblog.text = status.text;
                    item.mblog.created_at = status.created_at;
                    if (item.mblog.retweeted_status && status.retweeted_status) {
                        item.mblog.retweeted_status.created_at = status.retweeted_status.created_at;
                    }
                }

                // 转发的长微博处理
                const retweet = item.mblog.retweeted_status;
                if (retweet && retweet.isLongText) {
                    const retweetData = await weiboUtils.getShowData(retweet.user.id, retweet.bid);
                    if (retweetData !== undefined && retweetData.text) {
                        item.mblog.retweeted_status.text = retweetData.text;
                    }
                }
                let description = '';
                if (item.mblog.isLongText) {
                    description = await ctx.cache.tryGet(`weibo:extend:${item.mblog.bid}`, async () => {
                        const extendResponse = await got({
                            method: 'get',
                            url: `https://m.weibo.cn/statuses/extend?id=${item.mblog.mid}`,
                            headers: {
                                'Referer': `https://m.weibo.cn/u/${uid}`,
                                'MWeibo-Pwa': 1,
                                'X-Requested-With': 'XMLHttpRequest',
                                'User-Agent': ua,
                            },
                        });
                        return get(extendResponse, 'data.data.longTextContent', '');
                    });
                } else {
                    description = get(status, 'text', '');
                }

                const image = toImageHtml(status);
                if (image) {
                    description += `<br>${image}`;
                }


                const link = `https://weibo.com/${uid}/${item.mblog.bid}`;
                const title = cheerio.load(status.text).text();
                const pubDate = isDataOK ? new Date(status.created_at).toUTCString() : date(item.mblog.created_at, 8);

                return {
                    title: title,
                    description: description,
                    link: link,
                    guid: hash(description),
                    pubDate: pubDate,
                    author: item.mblog.user.screen_name,
                };
            })
    );

    ctx.state.data = {
        title: `微博 '${keyword}' 搜索结果`,
        link: `https://m.weibo.cn/search?containerid=${containerId}`,
        item: resultItem,
    };
};

endpoint.path = '/weibo/search/:keyword';

endpoint.name = 'Weibo Search';

endpoint.examples = ['/weibo/search/创业'];


module.exports = endpoint;
