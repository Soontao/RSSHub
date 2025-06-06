const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");
const iconv = require("iconv-lite"); // 转码

// 完整文章页
async function load(link) {
  const response = await got.get(link, {
    responseType: "buffer",
  });

  const data = iconv.decode(response.data, "gb2312"); // 转码

  // 加载文章内容
  const $ = cheerio.load(data);

  // 解析日期
  const date = new Date(
    $(".article")
      .text()
      .match(/\d{4}-\d{2}-\d{2}/),
  );

  const timeZone = 8;
  const serverOffset = date.getTimezoneOffset() / 60;
  const pubDate = new Date(
    date.getTime() - 60 * 60 * 1000 * (timeZone + serverOffset),
  ).toUTCString();

  // 提取内容
  const description = $(".article_con").html();

  // 返回解析的结果
  return { description, pubDate };
}

const ProcessFeed = async (base, list, caches) =>
  // 使用 Promise.all() 进行 async 并发
  await Promise.all(
    // 遍历每一篇文章
    list.map(async (item) => {
      const $ = cheerio.load(item);

      const $title = $("a");
      // 还原相对链接为绝对链接
      const itemUrl = new URL($title.attr("href"), base).href; // 感谢@hoilc指导

      // 列表上提取到的信息
      const single = {
        title: $title.text(),
        link: itemUrl,
        author: "绿色新闻网",
        guid: itemUrl,
      };

      // 使用tryGet方法从缓存获取内容。
      // 当缓存中无法获取到链接内容的时候，则使用load方法加载文章内容。
      const other = await caches.tryGet(
        itemUrl,
        async () => await load(itemUrl),
      );

      // 合并解析后的结果集作为该篇文章最终的输出结果
      return Promise.resolve(Object.assign({}, single, other));
    }),
  );
module.exports = {
  ProcessFeed,
};
