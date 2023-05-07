const METADATA = {
  /**
   * service/website name
   */
  NAME: 'Chengdu News',
  /**
   * path of rsshub
   */
  PATH: '/news/chengdu',
  /**
   * exmaple path if with parameter
   */
  EXAMPLES: ['/news/chengdu']
}

const got = require('got');
const cheerio = require('cheerio');
const { Semaphore } = require('@newdash/newdash/functional/Semaphore');

const sem = new Semaphore(3);

/**
 * @param {import("koa").Context} ctx
 */
const endpoint = async (ctx) => {
  const url = "https://www.chengdu.cn/";

  const listResponse = await got(url);
  const $ = cheerio.load(listResponse.body);
  const title = '成都市新闻门户网站';
  const listItems = $('.main_left .mui-table-view a:nth-child(1)').get().slice(0, 10);

  const items = await Promise.allSettled(
    listItems.map((listItem) => {
      const link = $(listItem).attr('href')

      return ctx.cache.tryGet(
        link,
        async () => sem.use(async () => {
          const itemResponse = await got(link);
          const $item = cheerio.load(itemResponse.body);
          return {
            title: $item('#main > h3').text(),
            pubDate: $item('#main > div.con-sj > span').text().trim().substring(0, 16),
            description: $item('#main > div.con-p2').html(),
            author: $item('#main > div.con-sj > span > a').text(),
            link,
            guid: link,
          };
        })
      );
    })
  );

  ctx.state.data = {
    title,
    link: url,
    item: items.filter(item => item.status === 'fulfilled').map(item => item.value),
  };
};

/**
 * endpoint path
 */
endpoint.path = METADATA.PATH;

endpoint.name = METADATA.NAME;

endpoint.examples = METADATA.EXAMPLES;

module.exports = endpoint;
