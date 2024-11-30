const { fetchText, fetchJSON } = require("rss-libs/utils/http");
const cheerio = require("cheerio");
const { toHashCode } = require("@newdash/newdash/functional/toHashCode");

const config = {
  1000: "要闻",
  1003: "股市",
  1007: "环球",
  1005: "公司",
  1006: "地产",
  1118: "券商",
  1032: "金融",
  1119: "汽车",
  1111: "科创版",
};

module.exports = async (ctx) => {
  ctx.params.caty = ctx.params.caty || "1000";
  const title = config[ctx.params.caty];
  if (!title) {
    throw Error('Bad category. See <a href="https://docs.rsshub.app/finance.html#cai-lian-she-shen-du">docs</a>');
  }

  const link = `https://www.cls.cn/v3/depth/home/assembled/${ctx.params.caty}?app=CailianpressWeb&os=web&sv=7.2.2&sign=6ac194f4b3b39d45631708474e058b73`;
  const response = await fetchJSON(link);

  let list = response.data.depth_list.map((item) => ({
    title: item.title || item.brief,
    guid: toHashCode(`${ctx.params.caty}-${item.id}`),
    link: `https://www.cls.cn/detail/${item.id}`,
    pubDate: new Date(item.ctime * 1000).toUTCString(),
  }));

  list = list.concat(
    response.data.top_article.map((item) => ({
      title: item.title || item.brief,
      guid: toHashCode(`${ctx.params.caty}-${item.id}`),
      link: `https://www.cls.cn/detail/${item.id}`,
      pubDate: new Date(item.ctime * 1000).toUTCString(),
    }))
  );

  const items = await Promise.all(
    list.map((item) =>
      ctx.cache.tryGet(item.link, async () => {
        const detailResponse = await fetchText(item.link);
        const content = cheerio.load(detailResponse);

        item.description = content("div.detail-content").html();
        return item;
      })
    )
  );
  ctx.state.skip_pure = true;
  ctx.state.data = {
    title: `财联社 - ${title}`,
    link: "https://www.cls.cn/telegraph",
    item: items,
  };
};
