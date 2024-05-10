const got = require("@/utils/got");
const cheerio = require("cheerio");
const moment = require("moment");
const { trimPrefix } = require("@newdash/newdash/trimPrefix");

const ptype = {
  all: { name: "首页Feeds", url: "https://www.guancha.cn/" },
  redian: { name: "热点新闻", url: "https://www.guancha.cn/api/redian.htm" },
  member: { name: "观察者", url: "https://www.guancha.cn/api/member.htm" },
  gundong: {
    name: "滚动新闻",
    url: "https://www.guancha.cn/api/new_gundong.htm",
  },
};

const gczUserCommunityLinkReg =
  /https:\/\/user\.guancha\.cn\/main\/content\?id=[0-9]+/gm;

// 2020-08-31 08:14:58
const DATE_FORMAT = "YYYY-MM-DD hh:mm:ss";

module.exports = async (ctx) => {
  const type = ctx.params.type;
  const host = "https://www.guancha.cn";
  const url = ptype[type];
  let items = [];

  if (url !== undefined) {
    const listRes = await got(url.url);
    const $ = cheerio.load(listRes.body);
    const newsItem = $("h4 a").toArray();
    const links = newsItem
      .map((newsItem) => {
        const itemHref = $(newsItem).attr("href");
        if (itemHref.startsWith("http")) {
          return itemHref;
        }
        return `${host}${itemHref}`;
      })
      .filter((link) => link.startsWith(host))
      .filter((link) => !link.includes("video/gczvideo"));

    items = await Promise.all(
      links.map((itemLink) =>
        ctx.cache.tryGet(itemLink, async () => {
          const item = {
            link: itemLink,
            guid: itemLink,
          };
          const itemRes = await got(itemLink);
          const [gczCommunityLink] =
            itemRes.body.match(gczUserCommunityLinkReg) || [];
          if (gczCommunityLink !== undefined) {
            // 风闻
            // itemRes = await got(gczCommunityLink);
            // const $item = cheerio.load(itemRes.body);
            // rssPageItem.title = $item('h1').text();
            // rssPageItem.description = $item('.article-txt-content').html();
            item.link = gczCommunityLink;
          } else {
            const $item = cheerio.load(itemRes.body);
            $item("iframe").removeAttr("width");
            $item("iframe").removeAttr("style");
            item.title = $item("ul > li.left.left-main > h3").text();
            item.description = $item("div.content.all-txt").html();
            item.author = trimPrefix(
              $item(".time.fix > span:nth-child(3)").text() || "观察者网",
              "来源：",
            );
            try {
              const pubDateString = $item(
                $item(".time.fix span:nth-child(1)").get(0),
              ).text();
              item.pubDate = moment(pubDateString, DATE_FORMAT).toDate();
            } finally {
              // do nothing
            }
          }

          return item;
        }),
      ),
    );
  }

  // filter 风闻
  items = items.filter((item) => item.link.includes("www.guancha.cn"));

  ctx.state.data = {
    title: "观察者-首页新闻",
    link: host,
    description:
      "观察者网，致力于荟萃中外思想者精华，鼓励青年学人探索，建中西文化交流平台，为崛起中的精英提供决策参考。",
    allowEmpty: true,
    item: items,
  };
};
