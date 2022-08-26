const url = require('url');
const got = require('@/utils/got');
const cheerio = require('cheerio');
const { Semaphore } = require('@newdash/newdash/functional/Semaphore');
const logger = require('@/utils/logger');

const sem = new Semaphore(5);

const config = {
    latest: {
        link: '/information/web_news/latest',
        title: '最新',
    },
    recommend: {
        link: '/information/web_recommend',
        title: '推荐',
    },
    contact: {
        link: '/information/contact',
        title: '创投',
    },
    ccs: {
        link: '/information/ccs',
        title: '中概股',
    },
    travel: {
        link: '/information/travel',
        title: '汽车',
    },
    technology: {
        link: '/technology',
        title: '科技',
    },
    enterpriseservice: {
        link: '/information/enterpriseservice',
        title: '企服',
    },
    banking: {
        link: '/information/banking',
        title: '金融',
    },
    life: {
        link: '/information/happy_life',
        title: '生活',
    },
    innovate: {
        link: '/information/innovate',
        title: '创新',
    },
    estate: {
        link: '/information/real_estate',
        title: '房产',
    },
    workplace: {
        link: '/information/web_zhichang',
        title: '职场',
    },
    other: {
        link: '/information/other',
        title: '其他',
    },
};

const endpoint = async (ctx) => {
    const cfg = config[ctx.params.caty];
    if (!cfg) {
        throw Error('Bad category. See <a href="https://docs.rsshub.app/government.html#bei-jing-shi-wei-sheng-jian-kang-wei-yuan-hui">docs</a>');
    }

    const newsUrl = url.resolve('https://36kr.com/', cfg.link);
    const response = await got({
        method: 'get',
        url: newsUrl,
    });

    const data = JSON.parse(response.data.match(/<script>window\.initialState=(.*?)<\/script>/)[1]);

    const informationList = data.information.informationList
        .itemList
        .filter((item) => item.itemType === 10)
        .slice(0, 15)
        .map((item) => ({
            title: item.templateMaterial.widgetTitle,
            link: `https://36kr.com/p/${item.itemId}`,
            guid: `36kr://${item.itemId}`,
            pubDate: new Date(item.templateMaterial.publishTime).toUTCString(),
        }));

    ctx.state.data = {
        title: `36氪资讯 - ${cfg.title}`,
        link: newsUrl,
        item: await Promise.all(informationList.map(
            (item) => ctx.cache.tryGet(item.link, () => sem.use(async () => {
                try {
                    const contentResponse = await got({ method: 'get', url: item.link });
                    const content = cheerio.load(contentResponse.data);
                    item.description = content('div.common-width.content.articleDetailContent.kr-rich-text-wrapper').html();
                    item.author = content('a.title-icon-item').text();
                    return item;
                } catch (error) {
                    logger.error(`retrieve ${item.link} failed ${error}`);
                    return {};
                }
            }))
        )),
    };
};

endpoint.path = '/36kr/news/:caty';

endpoint.name = '36氪';

endpoint.examples = ['/36kr/news/latest'];


module.exports = endpoint;
