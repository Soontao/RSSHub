const got = require("rss-libs/utils/got");
const queryString = require("query-string");
const moment = require("moment");

module.exports = async (ctx) => {
  const response = await got({
    method: "get",
    prefixUrl: "https://cn.bing.com",
    url: "HPImageArchive.aspx",
    searchParams: queryString.stringify({
      format: "js",
      idx: 0,
      n: 7,
      mkt: "zh-CN",
    }),
  });
  const data = response.data;
  ctx.state.data = {
    title: "Bing每日壁纸",
    link: "https://cn.bing.com/",
    item: data.images.map((item) => ({
      title: item.copyright,
      description: `<img src="https://cn.bing.com${item.url}">`,
      pubDate: moment(item.fullstartdate, "YYYYMMDDhhmm"),
      author: "Bing",
      link: item.copyrightlink,
    })),
  };
};
