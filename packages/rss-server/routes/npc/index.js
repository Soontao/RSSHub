const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
  const { caty } = ctx.params;
  // 主页
  const response = await got(`http://www.npc.gov.cn/npc/${caty}/list.shtml`);
  const data = response.body;
  const $ = cheerio.load(data, { decodeEntities: false });
  const title = $("title").text();
  // 获取每条的链接
  const links = $(".clist a")
    .map((index, item) => [$(item).attr("href")])
    .get();
  // 获取标题、日期
  const list = await Promise.all(
    links.map(async (link) => {
      const response = await got(`http://www.npc.gov.cn${link}`);
      const data = response.body;
      const $ = cheerio.load(data, { decodeEntities: false });
      const title = $("title").text().replace("_中国人大网", "");
      const time = $("span.fr").text();
      const description = $("#Zoom p")
        .map((index, item) => $.html(item))
        .get()
        .join("");
      return Promise.resolve([title, link, time, description]);
    }),
  );
  // 整合
  ctx.state.data = {
    title: title,
    link: `http://www.npc.gov.cn/npc/${caty}/list.shtml`,
    description: title,
    item: list.map((item) => ({
      title: item[0],
      link: `http://www.npc.gov.cn${item[1]}`,
      pubDate: new Date(
        item[2].substr(0, 4),
        parseInt(item[2].substr(5, 2)) - 1,
        item[2].substr(8, 2),
        item[2].substr(12, 2),
        item[2].substr(15, 2),
        item[2].substr(18, 2),
      ).toUTCString(),
      description: item[3],
    })),
  };
};
