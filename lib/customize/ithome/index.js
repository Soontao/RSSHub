/**
 * @type {import("got").Got}
 */
const got = require("@/utils/got");
const cheerio = require("cheerio");
const moment = require("moment");
const { isEmpty } = require("@newdash/newdash/isEmpty");

const get_url = (caty) => `https://${caty}.ithome.com/`;

const config = {
  it: {
    title: "IT 资讯",
  },
  soft: {
    title: "软件之家",
  },
  win10: {
    title: "win10 之家",
  },
  iphone: {
    title: "iphone 之家",
  },
  ipad: {
    title: "ipad 之家",
  },
  android: {
    title: "android 之家",
  },
  digi: {
    title: "数码之家",
  },
  next: {
    title: "智能时代",
  },
};

const endpoint = async (ctx) => {
  const cfg = config[ctx.params.caty];
  if (!cfg) {
    throw Error(
      "Bad category. See <a href=\"https://docs.rsshub.app/new-media.html#it-zhi-jia\">https://docs.rsshub.app/new-media.html#it-zhi-jia</a>",
    );
  }

  const current_url = get_url(ctx.params.caty);
  const response = await got({
    method: "get",
    url: current_url,
  });

  const $ = cheerio.load(response.data);
  const list = $("#list > div.fl > ul > li > div > h2 > a")
    .slice(0, 10)
    .map((_, item) => {
      item = $(item);
      return {
        title: item.text(),
        link: item.attr("href"),
      };
    })
    .get();

  const items = await Promise.all(
    list.map(
      async (item) =>
        await ctx.cache.tryGet(item.link, async () => {
          const res = await got({
            method: "get",
            url: item.link,
            throwHttpErrors: false,
          });
          if (res.statusCode !== 200) {
            // TODO: log
            return;
          }
          const content = cheerio.load(res.data);
          const post = content("#dt > div.fl.content");
          const paragraph = post.find("div#paragraph");
          paragraph.find("img[data-original]").each((_, ele) => {
            ele = $(ele);
            ele.attr("src", ele.attr("data-original"));
            ele.removeAttr("class");
            ele.removeAttr("data-original");
          });
          item.description = paragraph.html();
          item.pubDate = moment(
            content("span#pubtime_baidu").text(),
            "YYYY/M/DD h:mm:ss",
          ).toDate();
          item.author = content("#author_baidu strong").text() || "IT之家";
          return item;
        }),
    ),
  );

  ctx.state.data = {
    title: "IT 之家 - " + cfg.title,
    link: current_url,
    item: items.filter((item) => !isEmpty(item)),
  };
};

endpoint.path = "/ithome/:caty";

endpoint.name = "IT之家";

endpoint.examples = ["/ithome/it"];

module.exports = endpoint;
