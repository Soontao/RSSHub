const got = require('@/utils/got');
const utils = require('../../routes/weibo/utils');
const date = require('@/utils/date');
const { InMemoryCache } = require('@/middleware/cache/memory');
const md5 = require('@/utils/md5');
const baseInfoCache = new InMemoryCache();

const TITLE_LIMIT = 40;

const endpoint = async (ctx) => {
    const uid = ctx.params.uid;
    const displayVideo = '1';

    const baseInfo = await baseInfoCache.tryGet(`weibo-local-cache:${uid}`, async () => {
        const containerResponse = await got({
            method: 'get',
            url: `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}`,
            headers: { Referer: 'https://m.weibo.cn/' },
        });

        const name = containerResponse.data.data.userInfo.screen_name;
        const description = containerResponse.data.data.userInfo.description;
        const profileImageUrl = containerResponse.data.data.userInfo.profile_image_url;
        const containerid = containerResponse.data.data.tabsInfo.tabs[1].containerid;
        return { name, description, profileImageUrl, containerid };
    }, 60 * 15);

    const { name, description, profileImageUrl, containerid } = baseInfo;

    const response = await got({
        method: 'get',
        url: `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=${containerid}`,
        headers: {
            'Referer': `https://m.weibo.cn/u/${uid}`,
            'MWeibo-Pwa': 1,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        },
    });

    const resultItem = await Promise.all(
        response.data.data.cards
            .filter((item) => item.mblog)
            .map(async (item) => {

                const key = `weibo:user:${item.mblog.bid}`;
                return ctx.cache.tryGet(key, async () => {

                    // 可以判断出是否是长微博，如果不是那么不调下边的接口获取完整全文也行，但是拿不到准确的created_at，而是“几小时前”这种
                    // 索性就都再调接口获取详细data了，这个接口只返回json所以性能消耗不大。另外做了缓存处理
                    const data = await utils.getShowData(uid, item.mblog.bid);

                    // 是否通过api拿到了data
                    const isDataOK = data !== undefined && data.text;
                    if (isDataOK) {
                        item.mblog.text = data.text;
                    }
                    // 转发的长微博处理
                    const retweet = item.mblog.retweeted_status;
                    if (retweet && retweet.isLongText) {
                        const retweetData = await utils.getShowData(retweet.user.id, retweet.bid);
                        if (retweetData !== undefined && retweetData.text) {
                            item.mblog.retweeted_status.text = retweetData.text;
                        }
                    }

                    const link = `https://weibo.com/${uid}/${item.mblog.bid}`;
                    let description = utils.format(item.mblog);
                    let title = description.replace(/<img[\s\S]*?>/g, '[图片]').replace(/<.*?>/g, '');
                    if (title.length > TITLE_LIMIT) {
                        title = title.slice(0, TITLE_LIMIT) + '...';
                    }
                    const pubDate = isDataOK ? new Date(data.created_at).toUTCString() : date(item.mblog.created_at, 8);

                    // 视频的处理
                    if (displayVideo === '1') {
                        description = utils.formatVideo(description, item.mblog);
                    }

                    return {
                        title: title,
                        description: description,
                        link: link,
                        guid: md5(description),
                        author: name,
                        pubDate: pubDate,
                    };
                });

            })
    );

    ctx.state.data = {
        title: `${name}的微博`,
        link: `https://weibo.com/${uid}/`,
        description: description,
        image: profileImageUrl,
        item: resultItem,
    };
};

endpoint.path = '/weibo/user/:uid';

endpoint.name = 'Weibo User';

endpoint.examples = ['/weibo/user/1223450301'];


module.exports = endpoint;
