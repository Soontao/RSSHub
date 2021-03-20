const got = require('@/utils/got');
const querystring = require('querystring');
const weiboUtils = require('../../routes/weibo/utils');
const date = require('@/utils/date');
const cheerio = require('cheerio');
const { fallback, queryToBoolean } = require('@/utils/readable-social');
const { get } = require('@newdash/newdash');

const toImageHtml = (status) => {
    let html = '';

    // 添加微博配图
    if (status && status.pics) {
        status.pics.forEach(function(item) {
            html += `<img src="${item.large.url}">`;
        });
    }
    return html;
};

const endpoint = async(ctx) => {
    const uid = ctx.params.uid;

    const containerResponse = await got({
        method: 'get',
        url: `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}`,
        headers: {
            Referer: 'https://m.weibo.cn/',
        },
    });
    const name = containerResponse.data.data.userInfo.screen_name;
    const description = containerResponse.data.data.userInfo.description;
    const profileImageUrl = containerResponse.data.data.userInfo.profile_image_url;
    const containerid = containerResponse.data.data.tabsInfo.tabs[1].containerid;

    const response = await got({
        method: 'get',
        url: `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=${containerid}`,
        headers: {
            Referer: `https://m.weibo.cn/u/${uid}`,
            'MWeibo-Pwa': 1,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        },
    });

    const resultItem = await Promise.all(
        response.data.data.cards
        .filter((item) => item.mblog)
        .map(async(item) => {
            const status = item.mblog;

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
                description = await ctx.cache.tryGet(`weibo:extend:${item.mblog.bid}`, async() => {
                    const extendResponse = await got({
                        method: 'get',
                        url: `https://m.weibo.cn/statuses/extend?id=${item.mblog.mid}`,
                        headers: {
                            'Referer': `https://m.weibo.cn/u/${uid}`,
                            'MWeibo-Pwa': 1,
                            'X-Requested-With': 'XMLHttpRequest',
                            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                        },
                    });
                    return get(extendResponse, 'data.data.longTextContent', '');
                });

            } else {
                description = get(status, 'text', '');
            }

            description += '<br>';
            description += toImageHtml(status);


            const link = `https://weibo.com/${uid}/${item.mblog.bid}`;
            const title = cheerio.load(status.text).text();
            const pubDate = isDataOK ? new Date(status.created_at).toUTCString() : date(item.mblog.created_at, 8);

            return {
                title: title,
                description: description,
                link: link,
                pubDate: pubDate,
                author: item.mblog.user.screen_name,
            };
        })
    );

    ctx.state.data = {
        title: `${name}的微博`,
        link: `http://weibo.com/${uid}/`,
        description: description,
        image: profileImageUrl,
        item: resultItem,
    };
};

endpoint.path = '/weibo/user/:uid';

endpoint.name = 'Weibo User';

endpoint.examples = ['/weibo/user/1223450301'];


module.exports = endpoint;