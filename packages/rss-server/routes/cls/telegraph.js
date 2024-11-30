const got = require("rss-libs/utils/got");

module.exports = async (ctx) => {
  const link = "https://www.cls.cn/nodeapi/updateTelegraphList?rn=20";
  const response = await got({
    method: "get",
    url: link,
  });

  const list = response.data.data.roll_data.map((item) => ({
    title: item.title || item.content,
    description: item.content,
    pubDate: new Date(item.ctime * 1000).toUTCString(),
    guid: item.id,
    link: `https://api3.cls.cn/share/article/${item.id}`,
  }));

  ctx.state.data = {
    title: "财联社 - 电报",
    link: "https://www.cls.cn/telegraph",
    item: list,
  };
};
